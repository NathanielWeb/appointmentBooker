interface AuthCardProps {
    title: string
    subtitle: string
    children: React.ReactNode
}

export default function AuthCard({
    title,
    subtitle,
    children,
}: AuthCardProps) {
    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {title}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    {subtitle}
                </p>
            </div>

            {children}
        </div>
    )
}