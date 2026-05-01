import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  Menu, 
  X, 
  ChevronRight, 
  Calendar, 
  MessageCircle,
  Activity,
  Heart,
  User,
  ShieldCheck
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form Schema
const appointmentSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().regex(/^[0-9+]{10,15}$/, "Invalid phone number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  problem: z.string().min(10, "Please describe your problem in more detail"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const StatCounter = ({ end, duration = 2, suffix = "", decimals = 0 }: { end: number; duration?: number; suffix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(progress * end);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

const DOCTOR_DATA = {
  name: "Dr. Manish Choudhary",
  specialty: "Orthopedic Surgeon",
  rating: "5.0",
  reviewsCount: 377,
  phone: "+91 8079805579",
  whatsapp: "918079805579",
  address: "Rourkela Government Hospital (RGH), Near STI Chowk, Civil Township, Rourkela, Odisha 769012",
  tagline: "Advanced Orthopedic Care You Can Trust",
  timings: "Open 24 hours",
};

const SERVICES = [
  { id: 'knee', title: 'Knee Replacement', description: 'Advanced surgical procedures for chronic knee pain and arthritis using minimally invasive techniques.', icon: Activity, image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" },
  { id: 'acl', title: 'ACL Surgery', description: 'Expert ligament reconstruction to restore stability and function to your knee after sports injuries.', icon: ShieldCheck, image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop" },
  { id: 'arthritis', title: 'Arthritis Treatment', description: 'Comprehensive management plans including medication, physiotherapy, and modern biological therapies.', icon: Heart, image: "https://share.google/japUEfMRpGZnw5FEm" },
  { id: 'back', title: 'Back Pain', description: 'Specialized diagnosis and treatment for spine issues, herniated discs, and chronic lower back pain.', icon: User, image: "https://share.google/h0NtAWSW49lQG1OW7" },
  { id: 'fractures', title: 'Fractures', description: 'Emergency trauma care and precision fixation for complex bone fractures and musculoskeletal injuries.', icon: CheckCircle, image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema)
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-sky-100 selection:text-sky-900">
      {/* Sticky Navbar */}
      <nav 
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-sm border-b border-slate-200 backdrop-blur-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white font-bold shadow-md shadow-sky-100">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none text-slate-900">
                Dr. Manish Choudhary
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                Orthopedic Surgeon
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {['Home', 'Services', 'Reviews', 'Appointments', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-slate-500 transition-colors hover:text-sky-600"
              >
                {item}
              </a>
            ))}
            <a 
              href={`tel:${DOCTOR_DATA.phone}`}
              className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-100 transition-transform hover:bg-sky-700 active:scale-95"
            >
              {DOCTOR_DATA.phone}
            </a>
          </div>

          <button 
            className="text-medical-blue md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white px-6 md:hidden"
          >
            {['Home', 'About', 'Services', 'Appointments', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="py-4 font-serif text-3xl font-bold text-medical-blue"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 pt-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-8">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" /> OPEN 24 HOURS
                </div>
                <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] text-slate-900 md:text-6xl tracking-tight">
                  Advanced Orthopedic <br />
                  <span className="text-sky-600">Care You Can Trust</span>
                </h1>
                <p className="mb-10 max-w-lg text-lg text-slate-500 leading-relaxed">
                  Specialized in precision knee and hip surgeries with a patient-first approach at Rourkela Government Hospital.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#appointments" 
                    className="flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 font-bold text-white shadow-lg shadow-sky-100 transition-all hover:bg-sky-700 hover:translate-y-[-2px]"
                  >
                    Book Appointment <ChevronRight size={18} />
                  </a>
                  <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900">
                      <StatCounter end={5.0} decimals={1} />
                    </div>
                    <div>
                      <div className="flex text-orange-400 text-xs">★★★★★</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">377 Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 px-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-slate-900">
                    <StatCounter end={15} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Years Experience</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-slate-900">
                    <StatCounter end={5000} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Successful Surgeries</span>
                </div>
                <div className="flex flex-col col-span-2 md:col-span-1">
                  <div className="flex -space-x-3 items-center mb-1">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-bold">+</div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">10k+ Happy Patients</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block lg:col-span-5"
            >
              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-sky-600 text-white p-8 rounded-3xl shadow-xl">
                   <div className="text-3xl mb-4">⚡</div>
                   <h3 className="text-xl font-bold mb-2">Joint Repair</h3>
                   <p className="text-sm text-sky-100 opacity-90 leading-relaxed">Specialized knee and hip replacement surgery with modern recovery protocols.</p>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                   <div className="text-3xl mb-4 text-sky-600">🦴</div>
                   <h3 className="text-xl font-bold mb-2 text-slate-900">ACL Recovery</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Precision ligament repair designed for athletes and active lifestyles.</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-48 overflow-hidden rounded-3xl bg-slate-50 shadow-sm border border-slate-100">
                      <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" alt="Hospital ward" className="h-full w-full object-cover grayscale-[20%]" />
                    </div>
                    <div className="h-64 overflow-hidden rounded-3xl bg-sky-600 shadow-lg flex items-center justify-center p-8 text-white relative">
                      <div className="absolute top-4 left-4 text-4xl opacity-20 font-serif">"</div>
                      <p className="text-lg font-bold leading-relaxed relative z-10 italic">My mission is to provide the highest standard of orthopedic surgery with a patient-first approach at RGH.</p>
                      <div className="absolute bottom-4 right-4 text-4xl opacity-20 font-serif">"</div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-12">
                    <div className="h-64 overflow-hidden rounded-3xl bg-slate-50 shadow-sm border border-slate-100">
                       <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop" alt="Consultation" className="h-full w-full object-cover grayscale-[20%]" />
                    </div>
                    <div className="h-48 overflow-hidden rounded-3xl bg-slate-900 shadow-lg flex items-center justify-center">
                       <ShieldCheck size={64} className="text-sky-500/40" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-700">
                  Trusted Specialist
                </div>
                <h2 className="mb-6 mt-2 text-4xl font-extrabold text-slate-900 md:text-5xl tracking-tight">Expert Care for <br />Your Bone Health</h2>
                <div className="space-y-6 text-slate-500 leading-relaxed">
                  <p>
                    Dr. Manish Choudhary is a renowned Orthopedic Surgeon currently serving at Rourkela Government Hospital (RGH). With years of specialized training and advanced surgical experience, he has become a trusted name in complex orthopedic procedures in Odisha.
                  </p>
                  <p>
                    Specializing in joint replacements, ligament repairs, and advanced trauma care, Dr. Choudhary combines surgical precision with a holistic approach to rehabilitation, ensuring every patient achieves maximum functional recovery and returns to their active lifestyle.
                  </p>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">24/7 Availability</h4>
                      <p className="text-xs text-slate-400 font-medium">Emergency trauma services</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Patient Focused</h4>
                      <p className="text-xs text-slate-400 font-medium">Compassionate surgical care</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-slate-50 py-24 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Expertise & Solutions</span>
                <h2 className="mb-4 mt-2 text-4xl font-extrabold text-slate-900 tracking-tight">Our Core Services</h2>
                <p className="max-w-xl text-slate-500">Advanced diagnostic and surgical treatment options for all musculoskeletal conditions.</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <motion.div 
                  key={service.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-sky-600 shadow-sm backdrop-blur-sm">
                      <service.icon size={20} />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="mb-3 text-xl font-bold text-slate-900 tracking-tight">{service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="bg-white py-24 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16">
            <div className="mb-12 lg:mb-0 lg:w-1/3">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-orange-400 text-orange-400" size={18} />
                ))}
              </div>
              <h2 className="mb-6 text-4xl font-extrabold text-slate-900 tracking-tight">Trust from <br /><span className="text-sky-600">Our Patients</span></h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Join {DOCTOR_DATA.reviewsCount}+ satisfied patients who have trusted Dr. Manish Choudhary for their recovery in Rourkela.
              </p>
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 inline-block">
                <p className="text-5xl font-extrabold text-slate-900 mb-1 tracking-tighter">5.0 <span className="text-xl text-slate-400">/ 5.0</span></p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Google Reviews</p>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { name: "Suresh P.", text: "Excellent experience. Dr. Manish performed my knee surgery with precision. Recovery was faster than expected. Highly recommend him for any orthopedic issues.", location: "Rourkela" },
                  { name: "Anjali M.", text: "The most compassionate doctor at RGH. He explains everything clearly and doesn't rush the consultation. My father's back pain is finally gone.", location: "Jharsuguda" },
                  { name: "Vikram S.", text: "Best orthopedic surgeon in Odisha. I had an ACL tear from football, and thanks to his expertise, I am back on the field after 6 months of rehab.", location: "Bhubaneswar" },
                  { name: "Rajesh K.", text: "A true professional. Transparent about the process and very supportive during the post-op phase. The staff at the hospital were also very helpful.", location: "Rourkela" }
                ].map((review, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                    <p className="text-slate-600 mb-6 leading-relaxed text-sm italic">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">{review.name[0]}</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{review.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Appointment Form */}
        <section id="appointments" className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
               <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">Emergency Support</span>
                  <h2 className="mt-4 text-3xl font-bold mb-4 tracking-tight">Need Immediate Assistance?</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed text-sm">Our trauma team is available 24/7 for fractures and acute orthopedic injuries. Call our helpline directly for emergencies.</p>
                  <a href={`tel:${DOCTOR_DATA.phone}`} className="inline-flex items-center justify-center gap-3 w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-sky-50 transition-all active:scale-95 shadow-lg shadow-white/5">
                    <Phone size={20} /> Call 24/7 Support
                  </a>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-sky-600 rounded-full blur-[100px] opacity-20" />
               </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12">
                <div className="mb-10 text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Book Appointment</h3>
                  <p className="text-slate-500 text-sm">Fill in the details below and we'll confirm via call within 2 hours.</p>
                </div>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <CheckCircle size={40} />
                      </div>
                      <h3 className="mb-2 text-2xl font-bold text-slate-900">Appointment Requested</h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto">We've received your request. Our staff will reach out to you shortly.</p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="mt-8 text-sky-600 font-bold uppercase tracking-widest text-[10px] border-b-2 border-sky-100 hover:border-sky-600 transition-all"
                      >
                        Book Another
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                          <input 
                            {...register('name')}
                            placeholder="John Doe" 
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all"
                          />
                          {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                          <input 
                            {...register('phone')}
                            placeholder="+91 00000 00000" 
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all"
                          />
                          {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Preferred Date</label>
                          <input 
                            type="date"
                            {...register('date')}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all"
                          />
                          {errors.date && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.date.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Time Slot</label>
                          <select 
                            {...register('time')}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all appearance-none"
                          >
                            <option value="">Select Time Slot</option>
                            <option value="9am-12pm">Morning (10:00 AM)</option>
                            <option value="12pm-3pm">Afternoon (02:00 PM)</option>
                            <option value="6pm-9pm">Evening (06:00 PM)</option>
                          </select>
                          {errors.time && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.time.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Brief Problem Description</label>
                        <textarea 
                          {...register('problem')}
                          rows={2}
                          placeholder="Describe your issue..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all resize-none"
                        />
                        {errors.problem && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.problem.message}</p>}
                      </div>

                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all disabled:opacity-50 mt-2 active:scale-95"
                      >
                        {isLoading ? "Processing..." : "Confirm Appointment"}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
             <div className="grid gap-12 lg:grid-cols-2 items-center">
               <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">Location & Contact</span>
                  <h2 className="mb-8 mt-4 text-4xl font-extrabold text-slate-900 tracking-tight md:text-5xl">How to Reach Us</h2>
                  
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Our Location</h4>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">{DOCTOR_DATA.address}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Support Line</h4>
                        <p className="text-slate-500 text-sm mb-1">Available 24/7 for Patient Queries</p>
                        <a href={`tel:${DOCTOR_DATA.phone}`} className="text-xl font-bold text-sky-600 hover:underline">
                          {DOCTOR_DATA.phone}
                        </a>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="overflow-hidden rounded-[2.5rem] h-[400px] shadow-sm border border-slate-100 bg-slate-50">
                  <iframe 
                    title="Map Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.656041697274!2d84.8465038758814!3d22.253139344596328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a201cedfbcd1133%3A0x6b864a75e24c2ed2!2sRourkela%20Government%20Hospital%20(RGH)!5e0!3m2!1sen!2sin!4v1714533000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale-[30%] contrast-[1.1]"
                  />
               </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-16 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white font-bold">
                  M
                </div>
                <span className="text-xl font-bold tracking-tight">Dr. Manish Choudhary</span>
              </div>
              <p className="max-w-xs text-slate-400 text-sm leading-relaxed mb-6">
                Advanced orthopedic surgical care and treatment for joint replacement, sports injuries, and complex trauma at Rourkela Government Hospital.
              </p>
            </div>
            
            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Navigation</h4>
              <ul className="space-y-3">
                {['Home', 'Services', 'Reviews', 'Contact'].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-slate-400 hover:text-white transition-all text-sm font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Use', 'Medical Disclaimer'].map(link => (
                  <li key={link} className="text-slate-400 text-sm font-medium hover:text-white cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
            © {new Date().getFullYear()} Dr. Manish Choudhary • Orthopedic Surgeon
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Fab */}
      <a 
        href={`https://wa.me/${DOCTOR_DATA.whatsapp}?text=Hello Doctor, I want to book an appointment`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-medical-dark px-4 py-2 rounded-xl border border-gray-100 whitespace-nowrap font-bold shadow-lg text-sm">
           Chat on WhatsApp
        </span>
      </a>

      {/* Success Tooltip for Form */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-8 z-[60] bg-white border-l-4 border-medical-teal p-6 shadow-2xl rounded-2xl flex items-center gap-4 ring-1 ring-black/5"
          >
            <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
               <CheckCircle size={20} />
            </div>
            <div>
               <p className="font-bold text-medical-dark">Inquiry Sent!</p>
               <p className="text-xs text-gray-500">We'll call you shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
