from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include

from core.views import index,contact

urlpatterns = [
    path('',include('core.urls')),
    path('dashboard/',include('dashboard.urls')),
    # the alias of detail used here - all urls starting with items/ will go to into item.urls and check if pk is there to show detail of that item
    path('inbox/',include('conversation.urls')),
    path('items/',include('item.urls')),
    path('contact/',contact,name='contact'),
    path('admin/', admin.site.urls),
] 

# below line is to add images to html pages for rendering
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
