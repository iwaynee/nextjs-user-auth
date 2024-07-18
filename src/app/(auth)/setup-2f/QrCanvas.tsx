'use client';
import { useQRCode } from 'next-qrcode';

export const QrCanvas = ({ uri }: { uri: string }) => {
    const { Canvas } = useQRCode();

    return (
        <Canvas
            text={uri}
            options={{
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            }}
        />
    );
};
