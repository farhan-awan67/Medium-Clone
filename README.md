# 📝 WriteUp – A Medium Clone  

A full-featured blogging platform where users can create, read, edit, delete, and interact with posts. Built with the **MERN stack** and **Redux Toolkit** for a smooth, modern user experience.  

---

## 🚀 Features  
- 🧑‍💻 **User Authentication:** JWT-based login and registration  
- ✍️ **Post Management:** Create, edit, and delete posts  
- 💬 **Engagement:** Comment, like, and bookmark articles  
- 👥 **Social Features:** Follow and unfollow users  
- 🔔 **Real-Time Notifications**  
- 🗂️ **User Dashboard:** Manage profile and posts  
- 📱 **Responsive Design:** Works seamlessly on all devices  
- ☁️ **Cloudinary Integration:** Image upload and management  

---

## 🧠 Tech Stack  

**Frontend:** React, Redux Toolkit, Tailwind CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB (Mongoose)  
**Other Tools:** JWT, Axios, Cloudinary, bcrypt, CORS, dotenv  

---

## 🗂️ Project Structure  

### **Client**
```
├── 📁 public
│   └── 🖼️ vite.svg
├── 📁 src
│   ├── 📁 assets
│   │   ├── 🖼️ react.svg
│   │   └── 🖼️ writeUp_logo.png
│   ├── 📁 components
│   │   ├── 📄 BookmarkCard.jsx
│   │   ├── 📄 CommentInput.jsx
│   │   ├── 📄 CommentsSection.jsx
│   │   ├── 📄 Editor.jsx
│   │   ├── 📄 GlobalErrorBoundary.jsx
│   │   ├── 📄 Loading.jsx
│   │   ├── 📄 Navbar.jsx
│   │   ├── 📄 PersonRow.jsx
│   │   ├── 📄 PostCard.jsx
│   │   ├── 📄 ProtectedRoutes.jsx
│   │   └── 📄 TrendingTags.jsx
│   ├── 📁 features
│   │   ├── 📄 authSlice.js
│   │   ├── 📄 interactions.js
│   │   ├── 📄 notificationsSlice.js
│   │   ├── 📄 postSlice.js
│   │   └── 📄 uiSlice.js
│   ├── 📁 hooks
│   │   └── 📄 useValidate.js
│   ├── 📁 pages
│   │   ├── 📄 BookmarksPage.jsx
│   │   ├── 📄 DraftPosts.jsx
│   │   ├── 📄 EditPost.jsx
│   │   ├── 📄 FollowersFollowingPage.jsx
│   │   ├── 📄 Home.jsx
│   │   ├── 📄 Login.jsx
│   │   ├── 📄 NewPost.jsx
│   │   ├── 📄 Notifications.jsx
│   │   ├── 📄 PostsPage.jsx
│   │   ├── 📄 ProfilePage.jsx
│   │   ├── 📄 SpecificPost.jsx
│   │   └── 📄 SpecificUser.jsx
│   ├── 📁 store
│   │   └── 📄 store.js
│   ├── 📁 utils
│   │   ├── 📄 api.js
│   │   └── 📄 dayjs.js
│   ├── 📄 App.jsx
│   ├── 🎨 index.css
│   ├── 📄 main.jsx
│   └── 📄 socket.js
├── ⚙️ .gitignore
├── 📝 README.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 tailwind.config.js
└── 📄 vite.config.js
```
### **Server**
```
├── 📁 config
│   ├── 📄 cloudinary.js
│   └── 📄 db.js
├── 📁 controllers
│   ├── 📄 comments.controller.js
│   ├── 📄 posts.controller.js
│   ├── 📄 tagsController.controller.js
│   └── 📄 user.controller.js
├── 📁 middlewares
│   ├── 📄 auth.js
│   └── 📄 multer.js
├── 📁 models
│   ├── 📄 comments.model.js
│   ├── 📄 notifications.model.js
│   ├── 📄 post.model.js
│   ├── 📄 tags.model.js
│   └── 📄 user.model.js
├── 📁 routes
│   ├── 📄 comments.route.js
│   ├── 📄 notifications.route.js
│   ├── 📄 posts.routes.js
│   ├── 📄 tagsRoutes.route.js
│   └── 📄 user.routes.js
├── 📁 utils
│   ├── 📄 asyncHandler.js
│   └── 📄 sendNotification.js
├── ⚙️ .gitignore
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── 📄 server.js
```


---

## 🖼️ Screenshots  

| Home | Drafts | Post View |
|------|---------|------------|
| <img src="https://github.com/user-attachments/assets/724d44f6-a247-4d15-bb43-be62769df264" width="300"/> | <img src="https://github.com/user-attachments/assets/89307736-4265-4290-81b8-e0c95ed0ab27" width="300"/> | <img src="https://github.com/user-attachments/assets/09ad3607-c3c0-4f84-bbcd-f66f3fb386d5" width="300"/> |

| Profile | Bookmarks | Following/Followers |
|----------|------------|---------------------|
| <img src="https://github.com/user-attachments/assets/d59f5765-006e-4bb0-89d1-d53c360bf29d" width="300"/> | <img src="https://github.com/user-attachments/assets/5a310a15-f7db-4b95-a3cc-948ca4d29fb6" width="300"/> | <img src="https://github.com/user-attachments/assets/14326052-7c4a-4b05-93c3-3de042d37d31" width="300"/> |

| Posts | Notifications | New Post |
|--------|----------------|-----------|
| <img src="https://github.com/user-attachments/assets/c04c74e1-4031-4bc0-93ac-87e443ed997d" width="300"/> | <img src="https://github.com/user-attachments/assets/c5c8b765-607e-4d27-9ee7-51a7cb71ce64" width="300"/> | <img src="https://github.com/user-attachments/assets/a7387788-f453-4193-8c10-3cdd9623a50f" width="300"/> |

---

## 🔮 Future Enhancements  
- Infinite scrolling  
- Search and filtering  
- WebSocket-powered notifications  
- Dark mode  
- Microservices-based backend  

---

## 📬 Contact  

**Author:** Farhan  
**LinkedIn:** [linkedin.com/in/farhan](https://linkedin.com/in/farhan)  
**GitHub:** [github.com/yourusername](https://github.com/yourusername)  
