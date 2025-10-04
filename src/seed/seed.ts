import mongoose from 'mongoose';
import config from '../config';
import User from '../models/User';
import Event from '../models/Event';
import Menu from '../models/Menu';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

const run = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Seeder connected to Mongo');

    // Clear DB
    await User.deleteMany({});
    await Event.deleteMany({});
    await Menu.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    // ----- Organizers -----
    const organizers = await User.insertMany([
      { name: 'Abbas Ali', email: 'abbas@example.com', passwordHash: await bcrypt.hash('password', salt), role: 'organizer' },
      { name: 'Das Gajraj', email: 'gajraj@example.com', passwordHash: await bcrypt.hash('password', salt), role: 'organizer' },
      { name: 'Nishant Garg', email: 'nishant@example.com', passwordHash: await bcrypt.hash('password', salt), role: 'organizer' },
      { name: 'Harsh Sharma', email: 'Harsh@example.com', passwordHash: await bcrypt.hash('password', salt), role: 'organizer' },
      { name: 'Ritika Joshi', email: 'ritika@example.com', passwordHash: await bcrypt.hash('password', salt), role: 'organizer' },
      { name: 'Suresh Patel', email: 'suresh@example.com', passwordHash: await bcrypt.hash('password', salt), role: 'organizer' }
    ]);

    // ----- Vendors -----
    const vendors = await User.insertMany([
      { name: 'Annapurna Foods', email: 'annapurna@example.com', passwordHash: await bcrypt.hash('vendor', salt), role: 'vendor' },
      { name: 'Tandoori Tales', email: 'tandoori@example.com', passwordHash: await bcrypt.hash('vendor', salt), role: 'vendor' },
      { name: 'Curry Express', email: 'curryexpress@example.com', passwordHash: await bcrypt.hash('vendor', salt), role: 'vendor' },
      { name: 'Biryani Junction', email: 'biryani@example.com', passwordHash: await bcrypt.hash('vendor', salt), role: 'vendor' },
      { name: 'Chaat Bazaar', email: 'chaat@example.com', passwordHash: await bcrypt.hash('vendor', salt), role: 'vendor' },
      { name: 'South Spice', email: 'southspice@example.com', passwordHash: await bcrypt.hash('vendor', salt), role: 'vendor' }
    ]);

    // ----- Attendees -----
    await User.insertMany([
      { name: 'Rohit Sharma', email: 'rohit@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Priya Singh', email: 'priya@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Arjun Mehta', email: 'arjun@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Sneha Nair', email: 'sneha@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Karan Kapoor', email: 'karan@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Ananya Iyer', email: 'ananya@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Vikram Das', email: 'vikram@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Meera Reddy', email: 'meera@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Sanjay Verma', email: 'sanjay@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Divya Malhotra', email: 'divya@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Ashok Menon', email: 'ashok@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' },
      { name: 'Pooja Agarwal', email: 'pooja@example.com', passwordHash: await bcrypt.hash('attendee', salt), role: 'attendee' }
    ]);

    // ----- Events -----
    const events = await Event.insertMany([
      {
        title: 'TechConf 2025',
        description: 'Technology conference in Bengaluru.',
        organizerId: organizers[0]._id,
        venue: { name: 'Bengaluru International Expo Center', address: 'Whitefield, Bengaluru' },
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 3600 * 1000),
        mealSlots: [
          { id: 'breakfast-1', name: 'Day 1 Breakfast', startTime: new Date(), endTime: new Date(Date.now() + 3600 * 1000), capacity: 300 },
          { id: 'lunch-1', name: 'Day 1 Lunch', startTime: new Date(), endTime: new Date(Date.now() + 3 * 3600 * 1000), capacity: 400 },
          { id: 'dinner-1', name: 'Day 1 Dinner', startTime: new Date(), endTime: new Date(Date.now() + 7 * 3600 * 1000), capacity: 300 }
        ],
        vendorIds: [vendors[0]._id, vendors[1]._id, vendors[4]._id]
      },
      {
        title: 'Startup Summit Delhi',
        description: 'Annual entrepreneurship meet.',
        organizerId: organizers[1]._id,
        venue: { name: 'Pragati Maidan', address: 'New Delhi' },
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 3600 * 1000),
        mealSlots: [
          { id: 'lunch-2', name: 'Networking Lunch', startTime: new Date(), endTime: new Date(Date.now() + 2 * 3600 * 1000), capacity: 500 },
          { id: 'snacks-2', name: 'Evening Chai & Snacks', startTime: new Date(), endTime: new Date(Date.now() + 4 * 3600 * 1000), capacity: 400 }
        ],
        vendorIds: [vendors[2]._id, vendors[3]._id, vendors[5]._id]
      },
      {
        title: 'Cultural Fest Mumbai',
        description: 'Music, dance, and cultural showcase.',
        organizerId: organizers[2]._id,
        venue: { name: 'MMRDA Grounds', address: 'Bandra Kurla Complex, Mumbai' },
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
        mealSlots: [
          { id: 'lunch-3', name: 'Fest Lunch', startTime: new Date(), endTime: new Date(Date.now() + 3600 * 1000), capacity: 800 },
          { id: 'dinner-3', name: 'Fest Dinner', startTime: new Date(), endTime: new Date(Date.now() + 6 * 3600 * 1000), capacity: 700 }
        ],
        vendorIds: [vendors[0]._id, vendors[2]._id, vendors[3]._id]
      },
      {
        title: 'Hyderabad Food Carnival',
        description: 'A food-only carnival with stalls and tasting sessions.',
        organizerId: organizers[3]._id,
        venue: { name: 'Hitex Exhibition Center', address: 'Hyderabad' },
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 3600 * 1000),
        mealSlots: [
          { id: 'lunch-4', name: 'Hyderabadi Feast Lunch', startTime: new Date(), endTime: new Date(Date.now() + 2 * 3600 * 1000), capacity: 1000 }
        ],
        vendorIds: [vendors[3]._id, vendors[5]._id]
      }
    ]);

    // ----- Menus -----
    await Menu.insertMany([
      {
        vendorId: vendors[0]._id,
        eventId: events[0]._id,
        title: 'Annapurna Foods Menu',
        items: [
          { name: 'Idli Sambar', description: 'South Indian breakfast', price: 80, currency: 'INR', inventory: { total: 200, sold: 0 }, tags: ['vegetarian'] },
          { name: 'Masala Dosa', description: 'Crispy dosa with potato filling', price: 120, currency: 'INR', inventory: { total: 150, sold: 0 }, tags: ['vegetarian'] }
        ]
      },
      {
        vendorId: vendors[1]._id,
        eventId: events[0]._id,
        title: 'Tandoori Tales Menu',
        items: [
          { name: 'Chicken Tikka', description: 'Tandoori grilled chicken', price: 300, currency: 'INR', inventory: { total: 100, sold: 0 }, tags: [] },
          { name: 'Paneer Tikka', description: 'Grilled paneer skewers', price: 250, currency: 'INR', inventory: { total: 100, sold: 0 }, tags: ['vegetarian'] }
        ]
      },
      {
        vendorId: vendors[4]._id,
        eventId: events[0]._id,
        title: 'Chaat Bazaar Menu',
        items: [
          { name: 'Pani Puri', description: 'Crispy puris with spicy water', price: 50, currency: 'INR', inventory: { total: 300, sold: 0 }, tags: ['vegetarian'] },
          { name: 'Aloo Tikki Chaat', description: 'Spicy potato patties with chutneys', price: 70, currency: 'INR', inventory: { total: 200, sold: 0 }, tags: ['vegetarian'] }
        ]
      },
      {
        vendorId: vendors[3]._id,
        eventId: events[1]._id,
        title: 'Biryani Junction Menu',
        items: [
          { name: 'Hyderabadi Chicken Biryani', description: 'Fragrant rice with chicken', price: 250, currency: 'INR', inventory: { total: 300, sold: 0 }, tags: [] },
          { name: 'Veg Biryani', description: 'Vegetable biryani', price: 200, currency: 'INR', inventory: { total: 200, sold: 0 }, tags: ['vegetarian'] }
        ]
      },
      {
        vendorId: vendors[5]._id,
        eventId: events[1]._id,
        title: 'South Spice Menu',
        items: [
          { name: 'Chettinad Chicken Curry', description: 'Spicy South Indian chicken curry', price: 280, currency: 'INR', inventory: { total: 120, sold: 0 }, tags: [] },
          { name: 'Curd Rice', description: 'Soothing curd rice', price: 100, currency: 'INR', inventory: { total: 100, sold: 0 }, tags: ['vegetarian'] }
        ]
      }
    ]);

    logger.info('Seeder finished successfully ✅');
    process.exit(0);
  } catch (err) {
    logger.error('Seeder error', err as Error);
    process.exit(1);
  }
};

run();
