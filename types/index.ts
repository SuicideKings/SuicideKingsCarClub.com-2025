// =============================================================================
// CORE APPLICATION TYPES
// =============================================================================

// Base types
export type ID = string | number;
export type Timestamp = string | Date;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
  timestamp?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// =============================================================================
// USER & AUTHENTICATION TYPES
// =============================================================================

export type UserRole = 'admin' | 'member' | 'guest';
export type MembershipStatus = 'active' | 'pending' | 'expired' | 'suspended' | 'cancelled';

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Member extends User {
  memberNumber: string;
  membershipStatus: MembershipStatus;
  phone?: string;
  address?: Address;
  joinDate: Timestamp;
  renewalDate?: Timestamp;
  chapter?: Chapter;
  cars?: Car[];
  subscriptionId?: string;
  paymentMethod?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// =============================================================================
// CLUB & CHAPTER TYPES
// =============================================================================

export interface Club {
  id: ID;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: Address;
  chapters: Chapter[];
  settings: ClubSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Chapter {
  id: ID;
  clubId: ID;
  name: string;
  description?: string;
  location: string;
  state: string;
  region?: string;
  president?: Member;
  vicePresident?: Member;
  secretary?: Member;
  treasurer?: Member;
  memberCount: number;
  image?: string;
  contactEmail?: string;
  meetingSchedule?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClubSettings {
  membershipFee: number;
  renewalFee: number;
  allowPublicRegistration: boolean;
  requireApproval: boolean;
  paypalEnabled: boolean;
  stripeEnabled: boolean;
  emailNotifications: boolean;
  maintenanceMode: boolean;
}

// =============================================================================
// CAR TYPES
// =============================================================================

export type CarStatus = 'active' | 'sold' | 'restored' | 'project';

export interface Car {
  id: ID;
  memberId: ID;
  make: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  status: CarStatus;
  description?: string;
  images: CarImage[];
  modifications?: string[];
  restorationNotes?: string;
  purchaseDate?: Timestamp;
  purchasePrice?: number;
  currentValue?: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CarImage {
  id: ID;
  carId: ID;
  url: string;
  title?: string;
  description?: string;
  isMain: boolean;
  order: number;
  createdAt: Timestamp;
}

// =============================================================================
// EVENT TYPES
// =============================================================================

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventType = 'meeting' | 'show' | 'cruise' | 'social' | 'tech' | 'charity';

export interface Event {
  id: ID;
  organizerId: ID;
  chapterId?: ID;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  startDate: Timestamp;
  endDate: Timestamp;
  location: EventLocation;
  maxAttendees?: number;
  currentAttendees: number;
  registrationDeadline?: Timestamp;
  price?: number;
  isPublic: boolean;
  requiresRegistration: boolean;
  images: EventImage[];
  attendees: EventAttendee[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventLocation {
  name: string;
  address: Address;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  directions?: string;
  parking?: string;
}

export interface EventImage {
  id: ID;
  eventId: ID;
  url: string;
  title?: string;
  description?: string;
  isMain: boolean;
  order: number;
  createdAt: Timestamp;
}

export interface EventAttendee {
  id: ID;
  eventId: ID;
  memberId: ID;
  member: Member;
  registrationDate: Timestamp;
  status: 'registered' | 'attended' | 'no_show' | 'cancelled';
  guestCount: number;
  notes?: string;
}

// =============================================================================
// FORUM TYPES
// =============================================================================

export type ForumTopicStatus = 'open' | 'closed' | 'pinned' | 'locked';

export interface ForumCategory {
  id: ID;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isModerated: boolean;
  order: number;
  topicCount: number;
  postCount: number;
  lastPost?: ForumPost;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ForumTopic {
  id: ID;
  categoryId: ID;
  category: ForumCategory;
  authorId: ID;
  author: Member;
  title: string;
  slug: string;
  content: string;
  status: ForumTopicStatus;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  postCount: number;
  lastPost?: ForumPost;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ForumPost {
  id: ID;
  topicId: ID;
  topic: ForumTopic;
  authorId: ID;
  author: Member;
  content: string;
  isEdited: boolean;
  editedAt?: Timestamp;
  editedBy?: ID;
  parentPostId?: ID;
  parentPost?: ForumPost;
  replies: ForumPost[];
  replyCount: number;
  likes: number;
  isModerated: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================================================
// GALLERY TYPES
// =============================================================================

export type GalleryImageCategory = 'events' | 'cars' | 'meetings' | 'shows' | 'misc';

export interface GalleryImage {
  id: ID;
  uploaderId: ID;
  uploader: Member;
  title?: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  category: GalleryImageCategory;
  tags: string[];
  chapter?: Chapter;
  event?: Event;
  car?: Car;
  isPublic: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  metadata: ImageMetadata;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ImageMetadata {
  filename: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  exif?: Record<string, any>;
}

// =============================================================================
// STORE TYPES
// =============================================================================

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Product {
  id: ID;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  category: ProductCategory;
  status: ProductStatus;
  inventory: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: ProductImage[];
  variants?: ProductVariant[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductCategory {
  id: ID;
  name: string;
  description?: string;
  parentId?: ID;
  slug: string;
  image?: string;
  isActive: boolean;
  order: number;
  productCount: number;
}

export interface ProductImage {
  id: ID;
  productId: ID;
  url: string;
  alt?: string;
  isMain: boolean;
  order: number;
}

export interface ProductVariant {
  id: ID;
  productId: ID;
  name: string;
  sku?: string;
  price?: number;
  inventory: number;
  options: VariantOption[];
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface Order {
  id: ID;
  customerId: ID;
  customer: Member;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  product: Product;
  variantId?: ID;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MemberRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  clubId: number;
  chapterId?: number;
  address?: Partial<Address>;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  agreedToTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// =============================================================================
// UPLOAD TYPES
// =============================================================================

export type UploadFolder = 'gallery' | 'events' | 'chapters' | 'member-uploads' | 'products' | 'avatars';

export interface UploadData {
  folder: UploadFolder;
  title?: string;
  description?: string;
  chapter?: string;
  category?: string;
}

export interface UploadResponse {
  url: string;
  pathname: string;
  success: boolean;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ImageUploadProps extends ComponentProps {
  onUpload: (data: UploadResponse) => void;
  folder?: UploadFolder;
  aspectRatio?: 'square' | 'video' | 'auto';
  maxWidth?: number;
  metadata?: Partial<UploadData>;
  accept?: string;
  maxSize?: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  debounceMs?: number;
}

export interface FilterProps<T = Record<string, any>> {
  filters: T;
  onChange: (filters: T) => void;
  onReset: () => void;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// =============================================================================
// DATABASE TYPES
// =============================================================================

export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  ssl?: boolean;
  debug?: boolean;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  include?: string[];
  where?: Record<string, any>;
}

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  loginTime: number;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// =============================================================================
// PAYMENT TYPES
// =============================================================================

export interface PaymentProvider {
  name: 'paypal' | 'stripe';
  enabled: boolean;
  settings: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
}

// =============================================================================
// ANALYTICS TYPES
// =============================================================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Timestamp;
}

export interface MetricsData {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  upcomingEvents: number;
  totalCars: number;
  totalPosts: number;
  revenue: number;
  revenueGrowth: number;
}

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  // Re-export everything for convenience
  // This allows importing the entire types module if needed
};