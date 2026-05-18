'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Check, Star, MapPin, Phone, Mail, IndianRupee, BriefcaseBusiness, FileText, ShieldPlus, Loader2, Send, Search, Instagram, Facebook, MessageCircle, Menu, X, Quote, User, ChevronLeft, ChevronRight } from 'lucide-react'
import HeroSection from '@/components/hero-section'
import ServicesSection from '@/components/services-section'
import { UserNav } from '@/components/user-nav'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const TESTIMONIALS = [
  {
    name: 'Azeem Khan',
    company: 'The Forest Cafe',
    rating: 5,
    text: 'Outstanding service! Alpha Tax Consultant simplified our complex billing and expense tracking, saving us significant time. Highly recommended for any food business in Bareilly!',
    logo: '/client-1.jpeg',
  },
  {
    name: 'Waseem Uddin',
    company: 'Shakeel Warsi Traders',
    rating: 5,
    text: 'Professional and reliable. Their expertise in GST filing and Audit compliance for wood trading is top-notch. Our reports are always accurate and on time.',
    logo: '/client-2.jpeg',
  },
  {
    name: "Nazir Khan",
    company: "Eligible4U",
    rating: 5,
    text: "The best decision for our growth. Their strategic financial advice and tax planning helped us optimize our finances perfectly. Truly an expert team!",
    logo: '/client-3.jpeg',
  },
  {
    name: "Rajesh Kumar",
    company: "Shoppe",
    rating: 5,
    text: "Managing GST and Ecommerce portals was a headache until I joined hands with Alpha Tax Consultant. They handle my GSTR-1, 3B, and portal reconciliations perfectly. Highly recommended for online sellers!",
    logo: '/client-4.jpeg',
  },
  {
    name: "Salman Ali",
    company: "Gani Transport Company",
    rating: 5,
    text: "Alpha Tax Consultant is our go-to expert for transport accounting. They handle our complex RCM (Reverse Charge Mechanism) and Bilty (LR) reconciliations with zero errors. Their deep understanding of transport GST laws has saved us from heavy penalties.",
    logo: '/client-5.jpeg',
  },
  {
    name: "Umer Rashid Banday",
    company: "Himalayan Zest Co.",
    rating: 5,
    text: "Humne apne business ke liye Udyam aur FSSAI registration karwaya tha. Alpha Tax Consultant ne poora process bahut smoothly handle kiya. Unki professionalism aur speed kaafi prabhavit karne wali hai. Food business start karne walon ke liye best choice hai!",
    logo: "/client-6.jpg",
  }
];

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowWhatsApp(true)
      } else {
        setShowWhatsApp(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', msg: 'Message sent successfully! We will get back to you soon.' })
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        setSubmitStatus({ type: 'error', msg: 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', msg: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur min-h-[64px] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none text-primary">Alpha Tax</span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold mt-1">Consultant</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm hover:text-primary transition">Services</a>
              <a href="#about" className="text-sm hover:text-primary transition">About</a>
              <Link href="/blog" className="text-sm hover:text-primary transition">Updates</Link>
              <a href="#contact" className="text-sm hover:text-primary transition">Contact</a>
              <UserNav />
            </div>

            {/* Mobile Menu Toggle & User Nav */}
            <div className="flex items-center gap-4 md:hidden">
              <UserNav />
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border space-y-4 bg-background">
              <a
                href="#services"
                className="block text-base font-medium px-2 py-1 hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#about"
                className="block text-base font-medium px-2 py-1 hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <Link
                href="/blog"
                className="block text-base font-medium px-2 py-1 hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Updates
              </Link>
              <a
                href="#contact"
                className="block text-base font-medium px-2 py-1 hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-12 items-center">
            {/* Mobile-only Heading */}
            <div className="md:hidden">
              <h2 className="text-4xl font-bold">About Us</h2>
            </div>

            {/* Image */}
            <div className="relative h-96 w-full">
              <Image
                src="/aboutUs-image.png"
                alt="About us"
                fill
                className="object-cover rounded-2xl shadow-lg"
                priority
              />
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <div>
                <h2 className="hidden md:block text-4xl font-bold mb-4">About Us</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Alpha Tax Consultant is a premium firm dedicated to helping businesses achieve financial success through expert GST, ITR, Loan and Financial Planning. We focus on providing high-quality, professional service that you can trust.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Legal Expertise</h3>
                    <p className="text-muted-foreground">Combining accounting skills with legal insights for a complete solution.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Proven Reliability</h3>
                    <p className="text-muted-foreground">Trusted by local businesses in Bareilly for transparent and fast services.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Latest Technology</h3>
                    <p className="text-muted-foreground">Using modern accounting software and tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: 'Experienced Team',
                description: 'Expert guidance with deep accounting and legal knowledge',
              },
              {
                title: 'Fast & Accurate',
                description: 'Quick turnaround with meticulous attention to detail',
              },
              {
                title: '100% Confidential',
                description: 'Your financial information is completely secure',
              },
              {
                title: 'Affordable Pricing',
                description: 'Transparent pricing with no hidden charges',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-primary-foreground/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Client Testimonials</h2>
          <div className="relative px-0 md:px-12">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
                skipSnaps: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {TESTIMONIALS.map((testimonial, idx) => (
                  <CarouselItem key={idx} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <Card className="p-6 md:p-8 bg-card border border-border flex flex-col h-full hover:shadow-lg transition-shadow duration-300 select-none">
                      <div className="mb-4">
                        <div className="flex gap-0.5 mb-4">
                          {Array(testimonial.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                        </div>
                        <div className="relative">
                          <Quote className="w-8 h-8 text-primary/10 absolute -top-2 -left-2 rotate-180" />
                          <p className="text-muted-foreground mb-4 leading-relaxed italic relative z-10 pl-4">
                            &quot;{testimonial.text}&quot;
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-secondary text-primary border border-border shadow-sm flex-shrink-0 relative">
                          <User className="w-5 h-5 absolute text-primary/20" />
                          <Image
                            src={testimonial.logo}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover relative z-10"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground leading-none mb-1">{testimonial.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">{testimonial.company}</p>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12 h-12 w-12" />
                <CarouselNext className="-right-12 h-12 w-12" />
              </div>
              {/* Mobile controls */}
              <div className="flex justify-center gap-6 mt-8 md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full z-10"
                  onClick={() => api?.scrollPrev()}
                  disabled={!api?.canScrollPrev()}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full z-10"
                  onClick={() => api?.scrollNext()}
                  disabled={!api?.canScrollNext()}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Get In Touch</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus && (
                  <div className={`p-4 rounded-lg text-sm ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {submitStatus.msg}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Eg. Nadeem Khan"
                    className="w-full"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Eg. Nadeemkhan.acct@gmail.com"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Eg. 6301843321"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a service (Optional)</option>
                    <option value="GST Registration/Filing">GST Registration/Filing</option>
                    <option value="FSSAI License">FSSAI License</option>
                    <option value="ITR Filing">ITR Filing</option>
                    <option value="MSME/Udyam Registration">MSME/Udyam Registration</option>
                    <option value="eCommerce Business Setup">eCommerce Business Setup</option>
                    <option value="Bookeeping">Bookeeping</option>
                    <option value="Business Setup (Complete)">Business Setup (Complete)</option>
                    <option value="Loan / Project Report">Loan / Project Report</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your accounting needs"
                    rows={4}
                    className="w-full"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* WhatsApp Direct Message Button */}
                <a
                  href="https://wa.me/message/VA6S6FTVC2QNF1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Message on WhatsApp
                </a>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground">+91 6301843321</p>
                    <p className="text-muted-foreground text-sm">+91 9528873919</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">Nadeemkhan.acct@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-muted-foreground">Near Jhumka Chauraha, Parsa Khera, Bareilly,</p>
                    <p className="text-muted-foreground"> Uttar Pradesh 243502</p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="w-full h-[350px] md:h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2772.9666030072704!2d79.34280038279027!3d28.435391080670016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390aa87992ac860f%3A0x5b5e03cec7f7d763!2sAlpha%20Tax%20Consultant!5e1!3m2!1sen!2sin!4v1777872990264!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* FAQ Section */}
      < section className="py-20 bg-background" >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions.</h2>
            <p className="text-muted-foreground text-lg">
              Common queries jo clients aksar puchhte hain — koi aur sawal ho to seedha call ya WhatsApp kar dein.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-2 sm:p-6 shadow-sm border border-border">
            {[
              {
                question: "GST registration kitne din me ho jata hai?",
                answer: "GST registration aam taur par 1 se 7 working days me ho jata hai, agar aapke saare documents sahi hain. Kuch cases mein department ki query aane par thoda zyada samay lag sakta hai."
              },
              {
                question: "Income Tax Return filing ke liye kya documents chahiye?",
                answer: "Basic documents mein aapka PAN Card, Aadhaar Card, aur Bank Statement zaroori hain. Agar aap salaried hain toh Form 16, aur agar businessman hain toh Books of Accounts bhi chahiye hongi."
              },
              {
                question: "Loan approval me kitna time lagta hai?",
                answer: "Yeh loan ke type par depend karta hai. Personal ya Business loan aam taur par 5 se 10 din mein approve ho jate hain, jabki Home Loan ya Project-based loans mein thoda zyada waqt lag sakta hai."
              },
              {
                question: "Kya pure online process possible hai?",
                answer: "Ji haan, Alpha Tax Consultant poora kaam online handle karta hai. Aap apne documents WhatsApp (par 6301843321) ya Email (nadeemkhan.acct@gmail.com) par bhej sakte hain, aur aapko office aane ki zaroorat nahi padegi."
              },
              {
                question: "Charges kitne hote hain?",
                answer: "Humare charges kaam ki complexity aur service ke hisaab se hote hain. Hum affordable aur transparent pricing mein vishwas rakhte hain bina kisi hidden charges ke. Sahi estimate ke liye aap humein apni requirements ke saath message kar sakte hain."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group border-b border-border last:border-0">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-5 text-lg hover:text-primary transition-colors">
                  <span>{faq.question}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </span>
                </summary>
                <div className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-primary text-primary-foreground py-12 border-t border-border" >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Alpha Tax Consultant</h4>
              <p className="text-primary-foreground/80 text-sm">
                Professional accounting and tax services for your business.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#services" className="hover:text-white transition">GST Filing & Registration</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">Income Tax Return ( ITR )</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">MSME (Udyam) & FSSAI Registration</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">Transport & Ecomerece Portal Management</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition">About</a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">Contact</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition">Updates</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">Privacy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://jsdl.in/DT-996GYRDK7J1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Justdial
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/nadeemkhan.acct?igsh=ZWUyZG14MG83eHA1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/share/1CYfXFFiYJ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://whatsapp.com/channel/0029VbC5OzlKGGGOI2zLVm3H"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Whatsapp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8">
            <p className="text-center text-primary-foreground/80 text-sm">
              &copy; 2024 Alpha Tax Consultant. All rights reserved.
            </p>
          </div>
        </div>
      </footer >

      {/* Floating WhatsApp Button */}
      {showWhatsApp && (
        <a
          href="https://wa.me/message/VA6S6FTVC2QNF1"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-6 rounded-full font-bold transition-all duration-300 shadow-2xl hover:scale-110 animate-in fade-in slide-in-from-bottom-4"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Message on WhatsApp
        </a>
      )}
    </div >
  )
}
