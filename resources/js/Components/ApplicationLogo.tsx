export default function ApplicationLogo({ className = '', ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="SmartSchedule Logo"
            className={className}
        />
    );
}
