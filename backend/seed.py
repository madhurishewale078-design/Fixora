import sys
import os
import datetime

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app import models, auth
from app.config import settings

def seed_database():
    print('Initializing database tables...')
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Admin Account
        admin_email = settings.ADMIN_EMAIL.lower()
        admin_user = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin_user:
            admin_user = models.User(
                email=admin_email,
                hashed_password=auth.get_password_hash(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                phone='+91 98765 43210',
                role='ADMIN',
                is_active=True
            )
            db.add(admin_user)
            db.flush()
            print(f'Created Admin account: {admin_email}')
        else:
            print(f'Admin account already exists: {admin_email}')

        # 2. Seed Service Categories & Services
        categories_data = [
            {
                'name': 'Electrician',
                'slug': 'electrician',
                'icon': 'Zap',
                'description': 'Fan repair, switchboard replacement, MCB wiring, and appliance circuit installation.',
                'services': [
                    {'name': 'Ceiling Fan Repair & Installation', 'desc': 'Motor diagnosis, capacitor change, bearing lubrication, and blade balancing.', 'min': 299, 'max': 499, 'time': '45 mins'},
                    {'name': 'Switchboard & Socket Repair', 'desc': 'Modular switch replacement, plug point rewiring, and surge testing.', 'min': 249, 'max': 449, 'time': '30 mins'},
                    {'name': 'MCB & Fuse Box Short Circuit Fix', 'desc': 'Main distribution board load balancing and tripped breaker fault tracing.', 'min': 399, 'max': 899, 'time': '60 mins'},
                    {'name': 'Inverter & Home Wiring Check', 'desc': 'Complete safety inspection of earthing, battery terminals, and back-up load.', 'min': 499, 'max': 1199, 'time': '90 mins'}
                ]
            },
            {
                'name': 'Plumber',
                'slug': 'plumber',
                'icon': 'Droplets',
                'description': 'Leakage detection, tap cartridge replacement, flush cisterns, and water pipeline repair.',
                'services': [
                    {'name': 'Tap & Mixer Leakage Repair', 'desc': 'Ceramic disc cartridge replacement, Teflon sealing, and washer overhaul.', 'min': 249, 'max': 399, 'time': '30 mins'},
                    {'name': 'Drainage & Pipe Blockage Clearing', 'desc': 'Under-sink bottle trap and bathroom drain unclogging using pressure auger.', 'min': 349, 'max': 649, 'time': '45 mins'},
                    {'name': 'Toilet Flush Tank Repair', 'desc': 'Syphon flapper, fill valve, and dual flush button calibration.', 'min': 299, 'max': 549, 'time': '45 mins'},
                    {'name': 'Water Tank & Pipe Installation', 'desc': 'Overhead PVC water tank connection, float valve, and union joint fixing.', 'min': 699, 'max': 1899, 'time': '120 mins'}
                ]
            },
            {
                'name': 'AC Repair',
                'slug': 'ac-repair',
                'icon': 'Snowflake',
                'description': 'Split & window AC jet foam servicing, compressor capacitor, and gas refilling.',
                'services': [
                    {'name': 'Deep Clean Foam Jet Servicing', 'desc': 'High-pressure water pump cleaning of cooling coils, blower wheel, and tray.', 'min': 499, 'max': 799, 'time': '60 mins'},
                    {'name': 'AC Not Cooling / Gas Refill', 'desc': 'Nitrogen leak testing, brazing repair, vacuuming, and pure R32/R410A gas charge.', 'min': 899, 'max': 2499, 'time': '90 mins'},
                    {'name': 'Compressor Capacitor Replacement', 'desc': 'Testing dual run capacitor microfarad rating and replacement with OEM parts.', 'min': 449, 'max': 899, 'time': '40 mins'},
                    {'name': 'AC Installation & Uninstallation', 'desc': 'Bracket mounting, copper piping flare connection, and core hole drilling.', 'min': 799, 'max': 1499, 'time': '90 mins'}
                ]
            },
            {
                'name': 'RO Water Purifier',
                'slug': 'ro-service',
                'icon': 'Activity',
                'description': 'Sediment & carbon filter replacement, membrane scaling, and TDS balancing.',
                'services': [
                    {'name': 'Complete RO Service & Filter Change', 'desc': 'Pre-filter spun candle, sediment filter, carbon block, and TDS check.', 'min': 499, 'max': 1299, 'time': '60 mins'},
                    {'name': 'Booster Pump & SMPS Repair', 'desc': '24V power supply replacement and booster pump diaphragm inspection.', 'min': 599, 'max': 1499, 'time': '60 mins'},
                    {'name': 'RO Membrane Descaling', 'desc': 'High-rejection membrane replacement for borewell / high TDS water.', 'min': 899, 'max': 1799, 'time': '60 mins'}
                ]
            },
            {
                'name': 'Carpenter',
                'slug': 'carpenter',
                'icon': 'Hammer',
                'description': 'Door lock replacement, hinge repair, modular cabinet fitting, and furniture fix.',
                'services': [
                    {'name': 'Door Lock & Handle Fitting', 'desc': 'Mortise lock, cylindrical latch, and deadbolt alignment for main/room doors.', 'min': 299, 'max': 599, 'time': '45 mins'},
                    {'name': 'Cabinet & Wardrobe Hinge Fix', 'desc': 'Soft-close hydraulic concealed hinge replacement and drawer slide realignment.', 'min': 249, 'max': 499, 'time': '45 mins'},
                    {'name': 'Bed & Furniture Assembly / Repair', 'desc': 'Wooden joint tightening, bracket bracing, and plywood reinforcement.', 'min': 449, 'max': 999, 'time': '75 mins'}
                ]
            },
            {
                'name': 'Appliance Repair',
                'slug': 'appliance-repair',
                'icon': 'Tv',
                'description': 'Washing machine drum repair, microwave magnetron, and refrigerator cooling.',
                'services': [
                    {'name': 'Washing Machine Drum & Drain Fix', 'desc': 'Pulsator check, belt replacement, water inlet valve, and drain pump unclog.', 'min': 499, 'max': 1299, 'time': '60 mins'},
                    {'name': 'Refrigerator Thermostat & Defrost Fix', 'desc': 'Defrost timer, bimetal sensor, fan motor, and capillary inspection.', 'min': 499, 'max': 1499, 'time': '60 mins'}
                ]
            }
        ]

        cat_map = {}
        service_map = {}
        for cdata in categories_data:
            cat = db.query(models.ServiceCategory).filter(models.ServiceCategory.slug == cdata['slug']).first()
            if not cat:
                cat = models.ServiceCategory(
                    name=cdata['name'],
                    slug=cdata['slug'],
                    icon=cdata['icon'],
                    description=cdata['description']
                )
                db.add(cat)
                db.flush()
                print(f'Added Category: {cat.name}')
            cat_map[cat.slug] = cat

            for sdata in cdata['services']:
                svc = db.query(models.Service).filter(
                    models.Service.category_id == cat.id,
                    models.Service.name == sdata['name']
                ).first()
                if not svc:
                    svc = models.Service(
                        category_id=cat.id,
                        name=sdata['name'],
                        description=sdata['desc'],
                        price_estimate_min=sdata['min'],
                        price_estimate_max=sdata['max'],
                        duration_estimate=sdata['time'],
                        icon=cdata['icon']
                    )
                    db.add(svc)
                    db.flush()
                    print(f'  Added Service: {svc.name}')
                service_map[sdata['name']] = svc

        # 3. Seed Customers
        customer_users = [
            {'name': 'Rahul Sharma', 'email': 'rahul.sharma@example.com', 'phone': '+91 98221 11223', 'address': 'Flat 402, Green Glen Towers, Kothrud', 'city': 'Pune'},
            {'name': 'Priya Patel', 'email': 'priya.patel@example.com', 'phone': '+91 97332 22334', 'address': 'B-12, Sapphire Heights, Baner Road', 'city': 'Pune'},
            {'name': 'Amit Deshmukh', 'email': 'amit.deshmukh@example.com', 'phone': '+91 96443 33445', 'address': 'Villa 7, Silver Park, Viman Nagar', 'city': 'Pune'}
        ]

        customers = {}
        for c in customer_users:
            u = db.query(models.User).filter(models.User.email == c['email']).first()
            if not u:
                u = models.User(
                    email=c['email'],
                    hashed_password=auth.get_password_hash('User@12345'),
                    full_name=c['name'],
                    phone=c['phone'],
                    role='CUSTOMER',
                    is_active=True
                )
                db.add(u)
                db.flush()

                cp = models.CustomerProfile(
                    user_id=u.id,
                    address=c['address'],
                    city=c['city'],
                    latitude=18.5074,
                    longitude=73.8077
                )
                db.add(cp)
                db.flush()
                customers[c['email']] = cp
                print(f'Created Customer: {u.full_name}')
            else:
                customers[c['email']] = u.customer_profile

        # 4. Seed Technicians (Approved & Pending)
        technician_data = [
            {
                'name': 'Rajesh Kumar',
                'email': 'rajesh.electrician@example.com',
                'phone': '+91 99111 22233',
                'cat_slug': 'electrician',
                'exp': 7,
                'area': 'Kothrud, Shivajinagar & Deccan',
                'status': 'APPROVED',
                'rating': 4.9,
                'reviews': 28,
                'jobs': 64,
                'rate': 350.0,
                'lat': 18.5074,
                'lng': 73.8077,
                'bio': 'Certified Industrial & Residential Electrician with 7+ years expertise in safety compliance, motor repairs, and fault detection.',
                'avatar': 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Suresh Patil',
                'email': 'suresh.plumber@example.com',
                'phone': '+91 99222 33344',
                'cat_slug': 'plumber',
                'exp': 6,
                'area': 'Baner, Aundh & Pashan',
                'status': 'APPROVED',
                'rating': 4.8,
                'reviews': 19,
                'jobs': 42,
                'rate': 300.0,
                'lat': 18.5590,
                'lng': 73.7868,
                'bio': 'Master plumber specializing in concealed pipe leak isolation, pressure balancing, and sanitary installations.',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Sunita Verma',
                'email': 'sunita.ac@example.com',
                'phone': '+91 99333 44455',
                'cat_slug': 'ac-repair',
                'exp': 5,
                'area': 'Viman Nagar, Kalyani Nagar & Kharadi',
                'status': 'APPROVED',
                'rating': 4.95,
                'reviews': 34,
                'jobs': 78,
                'rate': 450.0,
                'lat': 18.5679,
                'lng': 73.9143,
                'bio': 'HVAC Certified refrigeration engineer. Precision pressure diagnostics, OEM capacitor replacement, and leak-free copper joints.',
                'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Vikram Singh',
                'email': 'vikram.carpenter@example.com',
                'phone': '+91 99444 55566',
                'cat_slug': 'carpenter',
                'exp': 8,
                'area': 'Hadapsar, Magarpatta & Wanowrie',
                'status': 'APPROVED',
                'rating': 4.75,
                'reviews': 15,
                'jobs': 38,
                'rate': 400.0,
                'lat': 18.5089,
                'lng': 73.9259,
                'bio': 'Artisan carpenter with mastery in modular fittings, German concealed hinges, and precision security door lock installation.',
                'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
            },
            {
                'name': 'Anil Shinde',
                'email': 'anil.ro@example.com',
                'phone': '+91 99555 66677',
                'cat_slug': 'ro-service',
                'exp': 4,
                'area': 'Wakad, Hinjewadi & Pimple Saudagar',
                'status': 'APPROVED',
                'rating': 4.85,
                'reviews': 22,
                'jobs': 51,
                'rate': 350.0,
                'lat': 18.5987,
                'lng': 73.7660,
                'bio': 'Water purification specialist. Thorough TDS metering, multi-stage sediment flushing, and booster pump repairs.',
                'avatar': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
            },
            # PENDING Technician for Admin Approval Demo!
            {
                'name': 'Dinesh Pawar',
                'email': 'dinesh.pawar@example.com',
                'phone': '+91 99666 77788',
                'cat_slug': 'electrician',
                'exp': 2,
                'area': 'Kothrud & Warje Pune',
                'status': 'PENDING',
                'rating': 5.0,
                'reviews': 0,
                'jobs': 0,
                'rate': 300.0,
                'lat': 18.4852,
                'lng': 73.8055,
                'bio': 'Diploma in Electrical Engineering. Specialized in domestic lighting, home automation switches, and inverter maintenance.',
                'avatar': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
            }
        ]

        tech_map = {}
        for t in technician_data:
            u = db.query(models.User).filter(models.User.email == t['email']).first()
            if not u:
                u = models.User(
                    email=t['email'],
                    hashed_password=auth.get_password_hash('Tech@12345'),
                    full_name=t['name'],
                    phone=t['phone'],
                    role='TECHNICIAN',
                    is_active=True
                )
                db.add(u)
                db.flush()

                cat = cat_map[t['cat_slug']]
                tp = models.TechnicianProfile(
                    user_id=u.id,
                    category_id=cat.id,
                    experience_years=t['exp'],
                    service_area=t['area'],
                    address=f'{t["area"]}, Pune',
                    city='Pune',
                    latitude=t['lat'],
                    longitude=t['lng'],
                    bio=t['bio'],
                    status=t['status'],
                    rating=t['rating'],
                    total_reviews=t['reviews'],
                    total_jobs=t['jobs'],
                    hourly_rate=t['rate'],
                    avatar_url=t['avatar']
                )
                # Link all category services to technician
                for s in cat.services:
                    tp.services.append(s)

                db.add(tp)
                db.flush()
                tech_map[t['email']] = tp
                print(f'Created Technician ({t["status"]}): {u.full_name}')
            else:
                tech_map[t['email']] = u.technician_profile

        # 5. Seed Bookings, Reviews, Complaints & Notifications
        existing_bookings = db.query(models.Booking).count()
        if existing_bookings == 0:
            cust1 = customers['rahul.sharma@example.com']
            cust2 = customers['priya.patel@example.com']
            tech_rajesh = tech_map['rajesh.electrician@example.com']
            tech_sunita = tech_map['sunita.ac@example.com']
            tech_suresh = tech_map['suresh.plumber@example.com']

            svc_fan = service_map['Ceiling Fan Repair & Installation']
            svc_ac = service_map['Deep Clean Foam Jet Servicing']
            svc_tap = service_map['Tap & Mixer Leakage Repair']

            # Booking 1: Completed with 5-star Review
            b1 = models.Booking(
                booking_number='FX-202509-E101',
                customer_id=cust1.id,
                technician_id=tech_rajesh.id,
                service_id=svc_fan.id,
                problem_description='Ceiling fan emitting humming sound and not spinning at full speed.',
                diagnosis_summary='Fixora Diagnosis: Capacitor weak, motor winding intact. Safe replacement recommended.',
                address=cust1.address,
                city='Pune',
                latitude=tech_rajesh.latitude,
                longitude=tech_rajesh.longitude,
                preferred_date='2025-09-07',
                preferred_time='11:00 AM',
                status='COMPLETED',
                estimated_cost=349.0,
                final_amount=349.0,
                completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
            )
            db.add(b1)
            db.flush()

            rev1 = models.Review(
                booking_id=b1.id,
                customer_id=cust1.id,
                technician_id=tech_rajesh.id,
                rating=5,
                comment='Rajesh arrived on time and replaced the fan capacitor in 20 minutes! The AI diagnosis was 100% accurate. Very transparent pricing.'
            )
            db.add(rev1)

            # Booking 2: In Progress
            b2 = models.Booking(
                booking_number='FX-202509-A202',
                customer_id=cust2.id,
                technician_id=tech_sunita.id,
                service_id=svc_ac.id,
                problem_description='AC cooling performance dropped significantly; dust accumulated on cooling coil.',
                diagnosis_summary='Fixora Diagnosis: Cleaned indoor mesh DIY; deep outdoor coil jet wash needed.',
                address=cust2.address,
                city='Pune',
                latitude=tech_sunita.latitude,
                longitude=tech_sunita.longitude,
                preferred_date='2025-09-09',
                preferred_time='02:00 PM',
                status='IN_PROGRESS',
                estimated_cost=599.0
            )
            db.add(b2)
            db.flush()

            # Booking 3: Pending request for Rajesh
            b3 = models.Booking(
                booking_number='FX-202509-P303',
                customer_id=cust1.id,
                technician_id=tech_suresh.id,
                service_id=svc_tap.id,
                problem_description='Kitchen sink mixer tap dripping continuously from spout.',
                diagnosis_summary='Fixora Diagnosis: Internal ceramic spindle worn out. Requires cartridge replacement.',
                address=cust1.address,
                city='Pune',
                latitude=tech_suresh.latitude,
                longitude=tech_suresh.longitude,
                preferred_date='2025-09-10',
                preferred_time='10:30 AM',
                status='PENDING',
                estimated_cost=299.0
            )
            db.add(b3)
            db.flush()

            # Booking 4: Completed with a Complaint
            b4 = models.Booking(
                booking_number='FX-202509-C404',
                customer_id=cust2.id,
                technician_id=tech_suresh.id,
                service_id=svc_tap.id,
                problem_description='Bathroom valve leak.',
                diagnosis_summary='Fixora Diagnosis: Valve seal replacement.',
                address=cust2.address,
                city='Pune',
                latitude=tech_suresh.latitude,
                longitude=tech_suresh.longitude,
                preferred_date='2025-09-05',
                preferred_time='04:00 PM',
                status='COMPLETED',
                estimated_cost=349.0,
                final_amount=349.0,
                completed_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
            )
            db.add(b4)
            db.flush()

            cmp1 = models.Complaint(
                complaint_number='CMP-202509-001',
                booking_id=b4.id,
                customer_id=cust2.id,
                technician_id=tech_suresh.id,
                subject='Slight dripping from angle cock after service',
                description='The technician was polite, but after 24 hours there is a tiny drip from the thread seal.',
                status='RESOLVED',
                admin_response='Technician visited for complimentary re-taping and inspection. Leak resolved.',
                resolved_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
            )
            db.add(cmp1)

            # Notifications
            db.add(models.Notification(
                user_id=admin_user.id,
                title='Pending Technician Application',
                message='Dinesh Pawar has applied for Electrician category in Kothrud. Needs verification.',
                type='APPROVAL',
                link_url='/admin/technicians'
            ))
            db.add(models.Notification(
                user_id=cust1.user.id,
                title='Booking Request Dispatched',
                message='Your booking FX-202509-P303 has been sent to Suresh Patil.',
                type='BOOKING',
                link_url='/customer/dashboard'
            ))
            db.add(models.Notification(
                user_id=tech_suresh.user.id,
                title='New Booking Request Received',
                message='Rahul Sharma has requested Tap & Mixer Leakage Repair on 2025-09-10.',
                type='BOOKING',
                link_url='/technician/dashboard'
            ))

            print('Added realistic demo bookings, reviews, complaints, and notifications!')

        db.commit()
        print('Database seed complete!')

    except Exception as e:
        db.rollback()
        print(f'Error during seeding: {e}')
        raise e
    finally:
        db.close()

if __name__ == '__main__':
    seed_database()
