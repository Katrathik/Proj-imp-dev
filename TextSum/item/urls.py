from django.urls import path

from . import views
 # the alias of detail 
app_name = 'item'

urlpatterns = [
    path('',views.items,name='items'),
    path('new/',views.new,name='new'),
    # shows detail of item based on the pk of item
    path('<int:pk>/',views.detail,name='detail'),
    path('<int:pk>/delete/',views.delete,name='delete'),
    path('<int:pk>/edit/',views.edit,name='edit'),

]