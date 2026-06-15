import { boolean, integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId:varchar()
});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid:varchar({ length: 255 }).notNull(),
  name:varchar(),
  description:varchar(),
  numberOfChapters:integer().notNull(),
  includeVideo:boolean().default(false),
  difficultyLevel:varchar().notNull(),
  category:varchar(),
  courseJson:json('courseJason'),
  bannerImageUrl:varchar().default(''),
  courseContent:json().default({}),
  userEmail: varchar('userEmail').references(() => usersTable.email)
});


export const enrollCourseTable=pgTable('enrollCourse',{
  id:integer().primaryKey().generatedAlwaysAsIdentity(),
  cid:varchar('cid').references(()=>coursesTable.cid),
  userEmail:varchar('userEmail').references(()=>usersTable.email).notNull(),
  completedChapters:json()
})

