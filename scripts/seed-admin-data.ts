import { db } from "@/lib/db"
import { clubs, members } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Sample clubs data
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

// Sample members data
const generateMembersData = (clubId: number, clubName: string) => [
  {
    clubId,
    name: `John Smith`,
    email: `john.smith@${clubName.toLowerCase().replace(/\s/g, "")}.com`,
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
    clubId,
    name: `Maria Rodriguez`,
    email: `maria.rodriguez@${clubName.toLowerCase().replace(/\s/g, "")}.com`,
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
    clubId,
    name: `David Johnson`,
    email: `david.johnson@${clubName.toLowerCase().replace(/\s/g, "")}.com`,
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
    clubId,
    name: `Jennifer Williams`,
    email: `jennifer.williams@${clubName.toLowerCase().replace(/\s/g, "")}.com`,
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
    clubId,
    name: `Robert Brown`,
    email: `robert.brown@${clubName.toLowerCase().replace(/\s/g, "")}.com`,
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

async function seedData() {
  try {
    console.log("🌱 Seeding admin data...")

    // Clear existing data
    await db.delete(members)
    await db.delete(clubs)

    // Insert clubs
    console.log("📋 Creating clubs...")
    const insertedClubs = await db.insert(clubs).values(clubsData).returning()
    console.log(`✅ Created ${insertedClubs.length} clubs`)

    // Insert members for each club
    console.log("👥 Creating members...")
    let totalMembers = 0
    
    for (const club of insertedClubs) {
      const membersData = generateMembersData(club.id, club.name)
      await db.insert(members).values(membersData)
      totalMembers += membersData.length
      
      // Update club member count
      await db
        .update(clubs)
        .set({ memberCount: membersData.length })
        .where(eq(clubs.id, club.id))
    }

    console.log(`✅ Created ${totalMembers} members across all clubs`)
    console.log("🎉 Database seeding completed successfully!")

  } catch (error) {
    console.error("❌ Error seeding data:", error)
    process.exit(1)
  }
}

// Run the seeding function
seedData()
  .then(() => {
    console.log("✨ Seeding process completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error)
    process.exit(1)
  })