from django.shortcuts import render,get_object_or_404,redirect
from django.contrib.auth.decorators import login_required
from item.models import Item
from .forms import ConversationMessageForm
from .models import Conversation 
# seperate views for a new conversation when we click on contact seller

@login_required
def new_conversation(request,item_pk):
    # get item from db
    item = get_object_or_404(Item,pk=item_pk)

    # if u are owner, u cnt visite this page
    if item.created_by == request.user:
        return redirect('dashboard:index')
    
    # get all conversations related to the item where u r a member
    # if the req is one of the members we can proceed
    conversations = Conversation.objects.filter(item=item).filter(members__in=[request.user.id])

    # if aldready a conversation goin on, redirect to it
    if conversations:
        return redirect('conversation:detail',pk=conversations.first().id)

    # if form is submitted
    if request.method == "POST":
        form = ConversationMessageForm(request.POST)

        # if content field filled properly, we can create a new conversation
        if form.is_valid():
            conversation = Conversation.objects.create(item=item)
            # add owner and buyer as members to conv
            conversation.members.add(request.user)
            conversation.members.add(item.created_by)
            conversation.save()

            # then we can crete the conversation message and refernec it to conversation
            conversation_message = form.save(commit=False)
            conversation_message.conversation = conversation
            conversation_message.created_by = request.user
            conversation_message.save()

            return redirect('item:detail',pk=item_pk)
        
    else:
        form = ConversationMessageForm()

    return render(request,'conversation/new.html',{
        'form':form
    })

@login_required
def inbox(request):
    # list all convos you are a member of
    conversations = Conversation.objects.filter(members__in=[request.user.id])

    return render(request,'conversation/inbox.html',{
        'conversations':conversations,
    })

@login_required
def detail(request,pk):
    conversation = Conversation.objects.filter(members__in=[request.user.id]).get(pk=pk)

    if request.method == 'POST':
        form = ConversationMessageForm(request.POST)

        if form.is_valid():
            conversation_message = form.save(commit=False)
            conversation_message.conversation = conversation
            conversation_message.created_by = request.user
            conversation_message.save()

            conversation.save()
            return redirect('conversation:detail',pk=pk)
        
    else:
        form = ConversationMessageForm()

            

    return render(request,'conversation/detail.html',{
        'conversation':conversation,
        'form':form,
    })

