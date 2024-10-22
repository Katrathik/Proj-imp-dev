from django.shortcuts import render,get_object_or_404,redirect
from .models import Item,Category
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from .forms import NewItemForm,EditItemForm

# Create your views here.
# no need of 

def items(request):
    query = request.GET.get('query','')
    category_id = request.GET.get('category',0)
    # get all categories
    categories = Category.objects.all()
    # get all objects not sold
    items = Item.objects.filter(is_sold=False)

    if query:
        # filters items based on name & Q(for both name and desc either of them) given by user
        #  in side search bar
        # if query present in name or desc, we get it filtered
        items = items.filter(Q(name__icontains=query) | Q(description__icontains=query))
    
    if category_id:
        # if category id of user matches with the one present, only show that category
        items = items.filter(category_id=category_id)


    return render(request,'item/items.html',{
        'items':items,
        'query':query,
        'categories':categories,
        'category_id':int(category_id),
    })

def detail(request,pk):
    item = get_object_or_404(Item,pk=pk)

    # get all toys of same category, excluding the current item(item on the big screen)
    related_items = Item.objects.filter(category=item.category,is_sold=False).exclude(pk=pk)[0:3]


    return render(request,'item/detail.html',{
        'item':item,
        'related_items':related_items
    })

@login_required
def new(request):
    if request.method == 'POST':
        form = NewItemForm(request.POST,request.FILES)

        if form.is_valid():
            item = form.save(commit=False)
            item.created_by = request.user
            item.save()

            return redirect('item:detail',pk=item.id)
    else:    
        form = NewItemForm()

    return render(request,'item/form.html',{
        'form':form,
        'title':'New Item'
    })

@login_required
def delete(request,pk):
    item = get_object_or_404(Item,pk=pk,created_by=request.user)
    item.delete()

    return redirect('dashboard:index')

@login_required
def edit(request,pk):
    item = get_object_or_404(Item,pk=pk,created_by=request.user)

    if request.method == 'POST':
        # set instance here too to avoid errors
        form = EditItemForm(request.POST,request.FILES,instance=item)

        if form.is_valid():
            # as created by is aldready set
            form.save()

            return redirect('item:detail',pk=item.id)
    else:    
        # to pass aldready entered data to edit
        form = EditItemForm(instance=item)

    return render(request,'item/form.html',{
        'form':form,
        'title':'Edit Item'
    })