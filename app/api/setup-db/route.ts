import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { adminUsers, clubs, members } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Check if we need to create a default admin user
    const data = await request.json().catch(() => ({}))

    if (data.createDefaultAdmin) {
      const adminEmail = data.adminEmail || "admin@suicidekingscc.com"
      const adminPassword = data.adminPassword || "admin123"
      const adminName = data.adminName || "Admin User"

      // Check if admin already exists
      const existingAdmin = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, adminEmail))
        .limit(1)

      if (existingAdmin.length === 0) {
        // Hash password
        const passwordHash = await bcrypt.hash(adminPassword, 10)

        // Create default admin user
        await db.insert(adminUsers).values({
          name: adminName,
          email: adminEmail,
          password: passwordHash,
          role: "admin",
        })
      }
    }

    // Create sample clubs data
    const clubsData = [
      {
        name: "Northern California",
        slug: "sknc",
        description: "Bringing Continental class to Northern California.",
        location: "Northern California",
        founded: "2018",
        memberCount: 0,
        isActive: true,
      },
      {
        name: "Inland Empire",
        slug: "skie",
        description: "The founding chapter of the Suicide Kings Car Club, established in 2016.",
        location: "Inland Empire, Southern California",
        founded: "2016",
        memberCount: 0,
        isActive: true,
      },
      {
        name: "Los Angeles",
        slug: "skla",
        description: "Representing the City of Angels with classic Continental style.",
        location: "Los Angeles, California",
        founded: "2017",
        memberCount: 0,
        isActive: true,
      },
      {
        name: "Washington",
        slug: "skwa",
        description: "Our Pacific Northwest chapter brings together Continental enthusiasts.",
        location: "Washington State",
        founded: "2018",
        memberCount: 0,
        isActive: true,
      },
      {
        name: "Coachella Valley",
        slug: "skcv",
        description: "Desert cruising with the finest Continentals in the valley.",
        location: "Coachella Valley, California",
        founded: "2019",
        memberCount: 0,
        isActive: true,
      },
    ]

    // Check if clubs already exist
    const existingClubs = await db.select().from(clubs).limit(1)
    
    if (existingClubs.length === 0) {
      // Insert clubs
      const insertedClubs = await db.insert(clubs).values(clubsData).returning()
      
      // Create sample members for each club
      const allMembers = []
      
      for (const club of insertedClubs) {
        const membersData = [
          {
            clubId: club.id,
            name: `John Smith`,
            email: `john.smith@${club.slug}.com`,
            phone: "+1 555-123-4567",
            role: "admin",
            membershipStatus: "active",
            bio: "Passionate about Lincoln Continentals since 1995. Owns a pristine 1967 Continental convertible.",
            carInfo: {
              make: "Lincoln",
              model: "Continental",
              year: 1967,
              color: "Midnight Blue",
              type: "Convertible",
            },
            membershipTier: "lifetime",
            joinDate: new Date("2020-01-15"),
            isEmailVerified: true,
          },
          {
            clubId: club.id,
            name: `Maria Rodriguez`,
            email: `maria.rodriguez@${club.slug}.com`,
            phone: "+1 555-234-5678",
            role: "officer",
            membershipStatus: "active",
            bio: "Classic car enthusiast and event coordinator. Specializes in Continental restoration.",
            carInfo: {
              make: "Lincoln",
              model: "Continental",
              year: 1965,
              color: "Wimbledon White",
              type: "Sedan",
            },
            membershipTier: "premium",
            joinDate: new Date("2020-03-20"),
            isEmailVerified: true,
          },
          {
            clubId: club.id,
            name: `David Johnson`,
            email: `david.johnson@${club.slug}.com`,
            phone: "+1 555-345-6789",
            role: "member",
            membershipStatus: "active",
            bio: "Weekend cruiser with a love for Continental classics. Recent member looking to learn more.",
            carInfo: {
              make: "Lincoln",
              model: "Continental",
              year: 1969,
              color: "Black",
              type: "Sedan",
            },
            membershipTier: "basic",
            joinDate: new Date("2023-06-10"),
            isEmailVerified: true,
          },
          {
            clubId: club.id,
            name: `Jennifer Williams`,
            email: `jennifer.williams@${club.slug}.com`,
            phone: "+1 555-456-7890",
            role: "member",
            membershipStatus: "pending",
            bio: "New member application. Excited to join the Continental community.",
            carInfo: {
              make: "Lincoln",
              model: "Continental",
              year: 1961,
              color: "Rangoon Red",
              type: "Convertible",
            },
            membershipTier: "basic",
            joinDate: new Date("2024-01-01"),
            isEmailVerified: false,
          },
          {
            clubId: club.id,
            name: `Robert Brown`,
            email: `robert.brown@${club.slug}.com`,
            phone: "+1 555-567-8901",
            role: "member",
            membershipStatus: "expired",
            bio: "Former active member. Membership expired but looking to renew soon.",
            carInfo: {
              make: "Lincoln",
              model: "Continental",
              year: 1963,
              color: "Silver",
              type: "Sedan",
            },
            membershipTier: "basic",
            joinDate: new Date("2021-09-15"),
            isEmailVerified: true,
          },
        ]
        
        allMembers.push(...membersData)
      }
      
      // Insert all members
      await db.insert(members).values(allMembers)
      
      // Update club member counts
      for (const club of insertedClubs) {
        await db
          .update(clubs)
          .set({ memberCount: 5 })
          .where(eq(clubs.id, club.id))
      }
    }

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database" }, { status: 500 })
  }
}
