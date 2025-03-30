'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import IconBook from '@/components/icon/icon-book';
import VideoTutorial from '@/components/help/VideoTutorial';
import Faq from '@/components/help/Faq';
import Contact from '@/components/help/Contact';
import { tutorialVideos, faqItems, contactItems } from '@/data/helpData';

const HelpPage = () => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Pusat Bantuan</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Pelajari cara menggunakan aplikasi Bani Web dengan mudah
                </p>
            </div>

            {/* Video Tutorials */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Video Tutorial</h2>
                <VideoTutorial 
                    items={tutorialVideos}
                    onVideoSelect={setSelectedVideo}
                />
            </div>

            {/* Separator */}
            <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                    <div className="bg-white dark:bg-gray-900 px-4">
                        <IconBook className="w-8 h-8 text-primary" />
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Pertanyaan Umum</h2>
                <div className="max-w-3xl mx-auto">
                    <Faq items={faqItems} />
                </div>
            </div>

            {/* Contact */}
            <div>
                <h2 className="text-xl font-semibold mb-6">Hubungi Kami</h2>
                <Contact 
                    items={contactItems}
                    className="max-w-3xl"
                />
            </div>

            {/* Video Modal */}
            <Modal
                open={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                type="video"
                size="xl"
            >
                <div className="aspect-video bg-black">
                    {/* Di sini bisa menggunakan komponen video player atau iframe YouTube */}
                    <div className="w-full h-full flex items-center justify-center text-white">
                        Video Player untuk ID: {selectedVideo}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default HelpPage;