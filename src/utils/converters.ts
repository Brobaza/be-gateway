import {
  Attachments,
  Conversation,
  Emoji,
  Links,
  Mention,
  Message,
  ReplyInfo,
  Url,
  User,
} from 'src/gen/chat.service';
import { GetUserResponse, UserAbout } from 'src/gen/user.service';
import { get, isDate, map } from 'lodash';

export const convertToUserAboutProto = (userAbout: any): UserAbout => {
  return {
    workRole: get(userAbout, 'workRole', ''),
    company: get(userAbout, 'company', ''),
    country: get(userAbout, 'country', ''),
    school: get(userAbout, 'school', ''),
    totalFollowers: get(userAbout, 'totalFollowers', 0),
    totalFollowing: get(userAbout, 'totalFollowing', 0),
    quote: get(userAbout, 'quote', ''),
    facebook: get(userAbout, 'facebook', ''),
    twitter: get(userAbout, 'twitter', ''),
    linkedin: get(userAbout, 'linkedin', ''),
    instagram: get(userAbout, 'instagram', ''),
  };
};

export const convertToUserProto = (user: any): GetUserResponse => {
  return {
    id: get(user, 'id', ''),
    name: get(user, 'name', ''),
    avatar: get(user, 'avatar', ''),
    phoneNumber: get(user, 'phoneNumber', ''),
    address: get(user, 'address', ''),
    location: get(user, 'location', ''),
    about: convertToUserAboutProto(get(user, 'about', {})),
    isPublic: get(user, 'isPublic', false),
    email: get(user, 'email', ''),
    gender: get(user, 'gender', ''),
    phoneVerifiedAt: get(user, 'phoneVerifiedAt', null),
    emailVerifiedAt: get(user, 'emailVerifiedAt', null),
    status: get(user, 'status', ''),
    role: get(user, 'role', ''),
  };
};

export const convertToUser = (user: any): User => {
  return {
    id: get(user, 'id', ''),
    name: get(user, 'name', ''),
    avatar: get(user, 'avatar', ''),
    phoneNumber: get(user, 'phoneNumber', ''),
    address: get(user, 'address', ''),
    location: get(user, 'location', ''),
    about: convertToUserAboutProto(get(user, 'about', {})),
    isPublic: get(user, 'isPublic', false),
    email: get(user, 'email', ''),
    gender: get(user, 'gender', ''),
    phoneVerifiedAt: get(user, 'phoneVerifiedAt', null),
    emailVerifiedAt: get(user, 'emailVerifiedAt', null),
    status: get(user, 'status', ''),
    role: get(user, 'role', ''),
  };
};

export const convertToMention = (mention: any): Mention => {
  return {
    userId: get(mention, 'userId', ''),
    displayName: get(mention, 'displayName', ''),
    startIndex: get(mention, 'startIndex', 0),
    endIndex: get(mention, 'endIndex', 0),
  };
};

export const convertToUrl = (url: any): Url => {
  return {
    url: get(url, 'url', ''),
    thumbnailImage: get(url, 'thumbnailImage', ''),
    startIndex: get(url, 'startIndex', 0),
    endIndex: get(url, 'endIndex', 0),
    title: get(url, 'title', ''),
    description: get(url, 'description', ''),
  };
};

export const convertToEmoji = (emoji: any): Emoji => {
  return {
    emoji: get(emoji, 'emoji', ''),
    userId: get(emoji, 'userId', ''),
  };
};

export const convertToReplyInfo = (replyInfo: any): ReplyInfo => {
  return {
    messageId: get(replyInfo, 'messageId', ''),
    body: get(replyInfo, 'body', ''),
    isImage: get(replyInfo, 'isImage', false),
    senderName: get(replyInfo, 'senderName', ''),
  };
};

export const convertToMessage = (message: any): Message => {
  const createAt = get(message, 'createdAt', new Date());
  const updatedAt = get(message, 'updatedAt', new Date());

  return {
    id: get(message, 'id', ''),
    senderId: get(message, 'senderId', ''),
    body: get(message, 'body', ''),
    contentType: get(message, 'contentType', ''),
    mentions: get(message, 'mentions', []).map(convertToMention),
    previewUrl: get(message, 'previewUrl', []).map(convertToUrl),
    emojis: get(message, 'emojis', []).map(convertToEmoji),
    replyInfo: convertToReplyInfo(get(message, 'replyInfo', {})),

    // date time
    createdAt: isDate(createAt) ? createAt.toISOString() : createAt,
    updatedAt: isDate(updatedAt) ? updatedAt.toISOString() : updatedAt,
  };
};

export const convertToAttachment = (attachment: any): Attachments => {
  return {
    attachments: get(attachment, 'items', []).map((item: any) => ({
      id: get(item, 'id', ''),
      preview: get(item, 'preview', ''),
      senderId: get(item, 'senderId', ''),
      name: get(item, 'name', ''),
      type: get(item, 'type', ''),
    })),
    total: get(attachment, 'total', 0),
  };
};

export const convertToLinks = (links: any): Links => {
  return {
    total: get(links, 'total', 0),
    links: map(get(links, 'items', []), convertToUrl),
  };
};

export const convertToConversation = (conversation: any): Conversation => {
  const createAt = get(conversation, 'createdAt', new Date());
  const updatedAt = get(conversation, 'updatedAt', new Date());
  const lastActivity = get(conversation, 'lastActivity', new Date());

  return {
    id: get(conversation, 'id', ''),
    type: get(conversation, 'type', ''),
    participants: get(conversation, 'participants', []).map(convertToUser),
    messages: get(conversation, 'messages', []).map(convertToMessage),

    // date time
    lastActivity: isDate(lastActivity)
      ? lastActivity.toISOString()
      : lastActivity,
    createdAt: isDate(createAt) ? createAt.toISOString() : createAt,
    updatedAt: isDate(updatedAt) ? updatedAt.toISOString() : updatedAt,

    // others
    attachments: convertToAttachment(
      get(conversation, 'attachments', {}),
    ) as Attachments,
    links: convertToLinks(get(conversation, 'links', {})),
  };
};
