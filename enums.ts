export enum UserRole {
  CLIENT = 'client',
  SUPPLIER = 'supplier',
  DELIVERY = 'delivery',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}

export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_OFFERS = 'awaiting_offers',
  OFFER_SUBMITTED = 'offer_submitted',
  OFFER_ACCEPTED = 'offer_accepted',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  WITH_DELIVERY = 'with_delivery',
  DELIVERED = 'delivered',
  HOLD_PERIOD = 'hold_period',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURN_REQUESTED = 'return_requested',
  RETURNED = 'returned',
  REPLACED = 'replaced',
}

export enum PaymentStatus {
  PENDING = 'pending',
  HELD = 'held',
  RELEASED = 'released',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum WalletTransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  HOLD = 'hold',
  RELEASE = 'release',
  REFUND = 'refund',
  CASHBACK = 'cashback',
  COMMISSION = 'commission',
  TRANSFER = 'transfer',
}

export enum NotificationType {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  CREDIT_NOTE = 'credit_note',
}

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}
