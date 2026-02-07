from .models import ActivityLog

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class ActivityLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Log specific actions
        if request.user.is_authenticated:
            path = request.path
            method = request.method
            
            # Log important actions
            if any(keyword in path for keyword in ['/login', '/register', '/booking', '/payment']):
                ActivityLog.objects.create(
                    user=request.user,
                    action=f"{method} {path}",
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
        
        return response