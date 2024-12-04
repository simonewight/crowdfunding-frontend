export function Card({ children, className = "", ...props }) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className = "", ...props }) {
    return (
      <div className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardTitle({ children, className = "", ...props }) {
    return (
      <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
        {children}
      </h3>
    );
  }
  
  export function CardDescription({ children, className = "", ...props }) {
    return (
      <p className={`text-sm text-gray-500 ${className}`} {...props}>
        {children}
      </p>
    );
  }
  
  export function CardContent({ children, className = "", ...props }) {
    return (
      <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
      </div>
    );
  }