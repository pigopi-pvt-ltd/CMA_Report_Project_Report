'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'

export default function UsageSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 120
            } as const
        }
    }

    const categories = [
        {
            title: "Manufacturing",
            items: [
                'Flour Mill (Atta Chakki) 🌾',
                'Spice Grinding Unit 🌶️',
                'Paper Plate & Cup Manufacturing 🧻',
                'Candle Making 🕯️',
                'Agarbatti (Incense Stick) Unit 🌀',
                'Detergent Powder/Liquid Manufacturing 🧼',
                'Disposable Bag Unit (Cloth/Paper) 🛍️',
                'Furniture Manufacturing 🪑',
                'And more'
            ]
        },
        {
            title: "Agriculture",
            items: [
                'Cow Dairy Farm 🐄',
                'Goat Farming 🐐',
                'Poultry Farm 🐓',
                'Fish Farming (Aquaculture) 🐟',
                'Vermicomposting Unit 🌿',
                'Mushroom Farming 🍄',
                'Organic Farming 🌱',
                'Bee Keeping (Apiculture) 🍯',
                'And more'
            ]
        },
        {
            title: "Service Sector",
            items: [
                'Two-Wheeler Repair Workshop 🛵',
                'Mobile & Computer Repair Shop 💻',
                'Beauty Parlour / Salon 💇‍♀️',
                'Coaching / Tuition Center 📚',
                'Courier & Parcel Service 📦',
                'Travel Booking & Ticketing Agency ✈️',
                'Photography Studio 📸',
                'And more'
            ]
        },
        {
            title: "Retail / Trading",
            items: [
                'Kirana / General Store 🛒',
                'Hardware Shop 🔧',
                'Electrical & Electronics Shop 💡',
                'Medical Store (Pharmacy) 💊',
                'Mobile Shop 📱',
                'Agriculture Equipment Trading 🚜',
                'And more'
            ]
        }
    ]

    return (
        <section className="py-20 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-3xl space-y-6 text-center mb-16 md:mb-24"
                >
                    <h1 className="text-center text-5xl font-extrabold tracking-tight lg:text-6xl">Who can use it?</h1>
                    <p className="text-muted-foreground text-xl md:text-2xl mt-4">Especially for Mudra | PMEGP | MSME | Business Loans and subsidy schemes</p>
                </motion.div>

                <motion.div 
                    className="grid gap-8 sm:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {categories.map((category, idx) => (
                        <motion.div 
                            key={idx} 
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/40 group bg-card overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-6">
                                    <CardTitle className="font-bold text-2xl group-hover:text-primary transition-colors">{category.title}</CardTitle>
                                </CardHeader>

                                <CardContent className="pt-6">

                                    <ul className="list-outside space-y-4 text-base font-medium text-muted-foreground">
                                        {category.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 group/item">
                                                <Check className="size-5 text-primary mt-0.5 shrink-0 transition-transform group-hover/item:scale-110" />
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
