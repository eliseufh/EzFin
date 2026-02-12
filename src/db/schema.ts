import {
  boolean,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// All tables are multi-tenant by `userId` (Clerk user id).
// We keep `userId` as `text` because Clerk ids are not UUID.

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),

    name: text("name").notNull(),
    type: transactionTypeEnum("type").notNull(),

    // Optional customization for UI
    color: text("color"),
    icon: text("icon"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("categories_user_id_idx").on(t.userId),
    userNameIdx: index("categories_user_name_idx").on(t.userId, t.name),
  })
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),

    type: transactionTypeEnum("type").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

    description: text("description"),
    occurredAt: date("occurred_at").notNull(),

    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("transactions_user_id_idx").on(t.userId),
    occurredAtIdx: index("transactions_occurred_at_idx").on(
      t.userId,
      t.occurredAt
    ),
    categoryIdx: index("transactions_category_idx").on(t.userId, t.categoryId),
  })
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),

    name: text("name").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    billingCycle: billingCycleEnum("billing_cycle").notNull(),
    nextDueAt: date("next_due_at").notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(t.userId),
    nextDueIdx: index("subscriptions_next_due_idx").on(t.userId, t.nextDueAt),
  })
);

export const goals = pgTable(
  "goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),

    name: text("name").notNull(),
    targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull(),
    currentAmount: numeric("current_amount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    dueAt: date("due_at"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("goals_user_id_idx").on(t.userId),
  })
);
