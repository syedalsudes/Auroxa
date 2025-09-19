"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({ images, title }: { images: string[], title: string }) {
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div className="flex gap-4">
            {images.length > 1 && (
                <div className="flex flex-col gap-3">
                    {images.map((img, idx) => {
                        const isActive = mainImage === img;
                        return (
                            <div
                                key={idx}
                                onMouseEnter={() => setMainImage(img)}
                                className={`cursor-pointer border rounded-lg overflow-hidden transition-all duration-200 ${
                                    isActive
                                        ? "brightness-75"
                                        : "hover:brightness-75"
                                }`}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                }}
                            >
                                <Image
                                    src={img || "/placeholder.svg"}
                                    alt={`${title} thumbnail ${idx}`}
                                    width={70}
                                    height={70}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Main Image */}
            <div className="border rounded-lg overflow-hidden flex-shrink-0">
                <Image
                    src={mainImage || "/placeholder.svg?height=600&width=600&query=product"}
                    alt={title}
                    width={500}
                    height={500}
                    className="object-contain w-[500px] h-[500px] bg-white"
                />
            </div>
        </div>
    );
}
