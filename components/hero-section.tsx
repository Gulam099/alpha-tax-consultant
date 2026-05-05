"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function HeroSection() {
    const images = [
        "/image-1.jpg",
        "/image-2.jpg",
        "/image-3.jpg",
        "/Photo.png"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="relative pt-12 md:pt-16 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* LEFT TEXT */}
                    <div className="space-y-8 pt-4 md:pt-10">

                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Your Trusted Partner for{" "}
                            <span className="text-primary">
                                Tax, Loan & Financial Services
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground font-medium">
                            GST | Income Tax | Loans | Insurance | Business Registration —{" "}
                            <span className="font-semibold text-foreground">
                                sab kuch ek hi jagah.
                            </span>{" "}
                            Bareilly ke trusted consultant ke saath apna kaam fast aur tension-free karayein.
                        </p>

                    </div>

                    {/* RIGHT IMAGE SLIDER */}
                    <div className="relative w-full">
                        <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg bg-muted">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Hero slider ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-card px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 z-20 border border-border/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-lg md:text-xl leading-none mb-1">1000+</p>
                                <p className="text-xs md:text-sm text-muted-foreground font-medium">Happy Clients</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}