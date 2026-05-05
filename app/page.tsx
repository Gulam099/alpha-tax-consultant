'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Check, Star, MapPin, Phone, Mail, IndianRupee, BriefcaseBusiness, FileText, ShieldPlus, Loader2, Send, Search, Instagram, Facebook, MessageCircle, Menu, X } from 'lucide-react'
import HeroSection from '@/components/hero-section'
import ServicesSection from '@/components/services-section'

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

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
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold mt-1">Consultancy</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm hover:text-primary transition">Services</a>
              <a href="#about" className="text-sm hover:text-primary transition">About</a>
              <Link href="/blog" className="text-sm hover:text-primary transition">Blog</Link>
              <a href="#contact" className="text-sm hover:text-primary transition">Contact</a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
                Blog
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
                src="/photo.png"
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
                  With over 10 years of experience in accounting and tax services, we&apos;ve helped hundreds of businesses achieve financial success. Our team of certified professionals is dedicated to providing the highest quality service with a personal touch.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Expert Team</h3>
                    <p className="text-muted-foreground">Qualified and experienced accounting professionals</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Proven Track Record</h3>
                    <p className="text-muted-foreground">10+ years of successful client relationships</p>
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
                description: 'Certified professionals with deep industry knowledge',
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
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                company: 'TechStart Solutions',
                rating: 5,
                text: 'Outstanding service! They simplified our accounting process and saved us significant time and money. Highly recommended!',
              },
              {
                name: 'Priya Sharma',
                company: 'Creative Designs Ltd',
                rating: 5,
                text: 'Professional, efficient, and reliable. Our financial reports are always accurate and on time. Great team to work with!',
              },
              {
                name: 'Amit Patel',
                company: 'Manufacturing Corp',
                rating: 5,
                text: 'The best decision we made for our business. Their expertise has helped us optimize our finances and plan for growth.',
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-8 bg-card border border-border">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                </div>
                <p className="text-muted-foreground mb-6">{testimonial.text}</p>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </Card>
            ))}
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
                    placeholder="Your name"
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
                      placeholder="your@email.com"
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
                      placeholder="Your phone number"
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
                    <option value="GST Filing">GST Filing</option>
                    <option value="Income Tax Return">Income Tax Return</option>
                    <option value="Audit Services">Audit Services</option>
                    <option value="Bookkeeping">Bookkeeping</option>
                    <option value="Business Registration">Business Registration</option>
                    <option value="Financial Planning">Financial Planning</option>
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
                    <p className="text-muted-foreground">nadeemkhan.acct@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-muted-foreground">Parsa Khera, Rampur Road, Bareilly</p>
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
                answer: "GST registration usually takes 3-7 working days after all complete documents are submitted."
              },
              {
                question: "Income Tax Return filing ke liye kya documents chahiye?",
                answer: "PAN card, Aadhaar card, Bank statements, and Form 16 (for salaried individuals) or business income details are typically required."
              },
              {
                question: "Loan approval me kitna time lagta hai?",
                answer: "Loan approval time depends on the bank and loan type, usually ranging from a few days for personal loans to a couple of weeks for business loans."
              },
              {
                question: "Kya pure online process possible hai?",
                answer: "Haan, hamara process 100% online hai. Aap apne documents WhatsApp ya email ke through bhej sakte hain."
              },
              {
                question: "Charges kitne hote hain?",
                answer: "Charges depend on the specific service required and complexity of the work. Please contact us for a customized quote."
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
              <h4 className="font-bold mb-4">AccountPro</h4>
              <p className="text-primary-foreground/80 text-sm">
                Professional accounting and tax services for your business.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#services" className="hover:text-white transition">GST Filing</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">Tax Returns</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">Audit Services</a>
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
              &copy; 2024 AccountPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer >
    </div >
  )
}
