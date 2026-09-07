import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real, boolean } from 'drizzle-orm/pg-core';

export const citizens = pgTable('citizens', {
  id: serial('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  preferredLanguage: text('preferred_language').default('en'),
  status: text('status').default('ACTIVE'),
  verificationStatus: text('verification_status').default('UNVERIFIED'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
});

export const citizenPreferences = pgTable('citizen_preferences', {
  id: serial('id').primaryKey(),
  citizenId: integer('citizen_id').references(() => citizens.id).notNull(),
  notificationSms: boolean('notification_sms').default(true),
  notificationEmail: boolean('notification_email').default(true),
  notificationPush: boolean('notification_push').default(true),
  locationSharing: boolean('location_sharing').default(true),
  profileVisibility: text('profile_visibility').default('PUBLIC_NAME'),
});

export const challengeLocations = pgTable('challenge_locations', {
  id: serial('id').primaryKey(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  accuracy: real('accuracy'),
  districtId: text('district_id'),
  blockId: text('block_id'),
  panchayatId: text('panchayat_id'),
  villageId: text('village_id'),
  source: text('source'),
});

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  citizenId: integer('citizen_id').references(() => citizens.id).notNull(),
  locationId: integer('location_id').references(() => challengeLocations.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  language: text('language').default('en'),
  reporterType: text('reporter_type').default('CITIZEN'),
  status: text('status').default('SUBMITTED'),
  visibility: text('visibility').default('PUBLIC'),
  domain: text('domain'),
  subdomain: text('subdomain'),
  aiConfidence: real('ai_confidence'),
  aiPriority: text('ai_priority'),
  aiReasoningFactors: text('ai_reasoning_factors'),
  projectId: text('project_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const challengeMedia = pgTable('challenge_media', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id').references(() => challenges.id).notNull(),
  type: text('type').notNull(),
  storageKey: text('storage_key').notNull(),
  mimeType: text('mime_type'),
  size: integer('size'),
  hash: text('hash'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  scanStatus: text('scan_status').default('PENDING'),
  processingStatus: text('processing_status').default('PENDING'),
  visibility: text('visibility').default('PUBLIC'),
});

export const challengeSupport = pgTable('challenge_support', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id').references(() => challenges.id).notNull(),
  citizenId: integer('citizen_id').references(() => citizens.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const integrityCases = pgTable('integrity_cases', {
  id: serial('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  trackingPinHash: text('tracking_pin_hash').notNull(),
  citizenId: integer('citizen_id').references(() => citizens.id), // optional
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').default('SUBMITTED'),
  department: text('department'),
  officeOrScheme: text('office_or_scheme'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const integrityCaseSupport = pgTable('integrity_case_support', {
  id: serial('id').primaryKey(),
  integrityCaseId: integer('integrity_case_id').references(() => integrityCases.id).notNull(),
  citizenId: integer('citizen_id').references(() => citizens.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const citizenResolutionFeedback = pgTable('citizen_resolution_feedback', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id').references(() => challenges.id).notNull(),
  citizenId: integer('citizen_id').references(() => citizens.id).notNull(),
  response: text('response').notNull(),
  evidence: text('evidence'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const citizensRelations = relations(citizens, ({ many }) => ({
  challenges: many(challenges),
  supports: many(challengeSupport),
  integritySupports: many(integrityCaseSupport),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  author: one(citizens, { fields: [challenges.citizenId], references: [citizens.id] }),
  location: one(challengeLocations, { fields: [challenges.locationId], references: [challengeLocations.id] }),
  media: many(challengeMedia),
  supports: many(challengeSupport),
}));
