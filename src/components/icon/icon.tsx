import Image from 'next/image';
import { motion } from 'framer-motion';

export default function MumetIcon({ size = 40 }: { size?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Image
                src="/img/mumet-in.png"
                alt="mumet.in logo"
                width={size}
                height={size}
                className="object-contain"
                priority
            />
        </motion.div>
    );
}