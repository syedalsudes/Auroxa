"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Gallery({ images, title }: { images: string[], title: string }) {
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImage(images[0]); // client pe safely set karein
        }
    }, [images]);

    if (!mainImage) return null; // hydration mismatch prevent karega

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-3">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        onMouseEnter={() => setMainImage(img)}
                        className="cursor-pointer border rounded-lg overflow-hidden transition-all duration-200"
                    >
                        <Image
                            src={img || "/placeholder.svg"}
                            alt={`${title} thumbnail ${idx}`}
                            width={70}
                            height={70}
                            className="object-cover w-full aspect-square md:w-[70px] md:h-[70px] bg-white"
                        />
                    </div>
                ))}
            </div>

            {/* Main Image Sticky */}
            <div className="flex-1 md:relative">
                <div className="md:sticky md:top-20">
                    <Image
                        src={mainImage}
                        alt={title}
                        width={500}
                        height={500}
                        className="object-contain w-full max-w-full rounded-md h-auto bg-white"
                    />
                </div>
            </div>
        </div>

    );
}
