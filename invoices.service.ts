import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Order } from '../orders/order.entity';
import { InvoiceStatus } from '../common/enums';
import * as crypto from 'crypto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async generateInvoice(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client', 'invoice'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.invoice) throw new NotFoundException('Invoice already exists');

    const invoiceNumber = `INV-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const vatRate = 0.15;
    const vatAmount = order.subtotal * vatRate;

    const invoice = this.invoiceRepository.create({
      invoiceNumber,
      orderId: order.id,
      supplierId: order.supplierId,
      clientId: order.clientId,
      subtotal: order.subtotal,
      vatAmount,
      vatRate,
      total: order.total,
      cashbackAmount: order.cashbackAmount || 0,
      status: InvoiceStatus.DRAFT,
      isPlatformInvoice: true,
    });

    await this.invoiceRepository.save(invoice);

    // ZATCA QR Code generation
    const qrData = this.generateZatcaQR(invoice);
    invoice.qrCode = qrData;

    // ZATCA XML generation
    const xmlContent = this.generateZatcaXML(invoice, order);
    invoice.xmlContent = xmlContent;

    await this.invoiceRepository.save(invoice);

    return invoice;
  }

  async issueInvoice(invoiceId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['order', 'client', 'supplier'],
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    invoice.status = InvoiceStatus.ISSUED;
    invoice.issuedAt = new Date();

    // TODO: Submit to ZATCA API
    // const zatcaResponse = await this.submitToZatca(invoice);
    // invoice.zatcaInvoiceId = zatcaResponse.invoiceId;
    // invoice.zatcaStatus = zatcaResponse.status;
    // invoice.zatcaResponse = zatcaResponse;

    await this.invoiceRepository.save(invoice);
    return invoice;
  }

  async getInvoicesForUser(userId: string, role: string) {
    const where = role === 'client' ? { clientId: userId } : { supplierId: userId };

    return this.invoiceRepository.find({
      where,
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async getInvoice(invoiceId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['order', 'client', 'supplier'],
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  private generateZatcaQR(invoice: Invoice): string {
    const sellerName = 'B2B Procurement Platform';
    const vatNumber = '310123456700003';
    const timestamp = invoice.issuedAt?.toISOString() || new Date().toISOString();

    const qrData = JSON.stringify({
      sellerName,
      vatNumber,
      timestamp,
      total: invoice.total,
      vatTotal: invoice.vatAmount,
    });

    return Buffer.from(qrData).toString('base64');
  }

  private generateZatcaXML(invoice: Invoice, order: Order): string {
    return `
<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${invoice.issuedAt?.toISOString().split('T')[0]}</cbc:IssueDate>
  <cbc:InvoiceTypeCode name="0100000">388</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:CompanyID>310123456700003</cbc:CompanyID>
      <cac:PartyName>
        <cbc:Name>B2B Procurement Platform</cbc:Name>
      </cac:PartyName>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>Customer</cbc:Name>
      </cac:PartyName>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="SAR">${invoice.subtotal}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="SAR">${invoice.subtotal}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="SAR">${invoice.total}</cbc:TaxInclusiveAmount>
    <cbc:PrepaidAmount currencyID="SAR">0</cbc:PrepaidAmount>
    <cbc:PayableAmount currencyID="SAR">${invoice.total}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="SAR">${invoice.vatAmount}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="SAR">${invoice.subtotal}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="SAR">${invoice.vatAmount}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>15.00</cbc:Percent>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
</Invoice>`;
  }
}
