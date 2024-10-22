from django.db import models
from django.contrib.auth.models import User
from item.models import Item

# Create your models here.

class Conversation(models.Model):
    item = models.ForeignKey(Item,related_name='conversations',on_delete=models.CASCADE)
    members = models.ManyToManyField(User,related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    # auto modifies the timestamp modified
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-modified_at',)

class ConversationMessage(models.Model):
    # if we delete an item, conv and msg also will be deleted
    conversation = models.ForeignKey(Conversation,related_name='messages',on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # if we dlete user, we also delete all the messages
    created_by = models.ForeignKey(User,related_name='created_messages',on_delete=models.CASCADE)
