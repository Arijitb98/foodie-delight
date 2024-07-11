FoodieDelight Admin Panel Documentation

Overview

FoodieDelight Admin Panel is a web application designed to manage restaurants, vendors and menu categories. It provides an interface for administrators to perform CRUD (Create, Read, Update, Delete) operations on various entities within the system.

Technologies Used

Frontend:

React.js, 
React Router DOM for navigation, 
Material-UI for UI components, 
Formik and Yup for form handling and validation


Backend:

Mock APIs for data management (CRUD operations)


Components and Features:

  1. Login

Component: Login. 

Description: Allows administrators to log in with email and password credentials. Implements validation for strong passwords.

Screenshots:

![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/5ba54771-a506-4d4a-9147-046f93d9c2d3)

  2. Restaurant Management

Component: RestaurantList, ManageRestaurant. 

Description: Allows CRUD operations for restaurants, including adding new restaurants, editing existing ones, and deleting them.

Screenshots:

The landing screen after logging in shows the list of restaurts and various related info
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/247b978b-31c6-4833-9590-e017826d42cc)

Adding a new restaurant
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/58026e70-c96f-46ed-9f1e-c869ac953e2e)

Editng an existing restaurant
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/31a36744-08e2-4435-bd7c-80e2b255b6da)

Also view/edit and delete menu items of the restaurant
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/2f49f7ab-8f2d-49dc-9e4d-439442630424)

Add a new item from scratch or select a predefined menu item
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/be4b205d-a4da-4d2e-b65c-c73359a6b618)

  3.Vendor Management

Component: VendorList, ModifyVendors. 

Description: View/edit/add and delete vendors, displaying vendor details, number of associated restaurants and allowing CRUD operations.

Screenshots:

Vendor list
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/8406efc4-7052-470e-85ad-18e568715fd4)

Modifying a vendor
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/710ce485-8333-4df2-bb11-58d726f643eb)

Adding new vendor
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/de54094c-ce79-4c57-94db-90f541757cb4)

  4.Menu Category Management

Component: PreDefinedMenuItems.

Description: Handles predeifned menu categories, including CRUD operations for adding, editing, and deleting menu items.

Screenshots: 

Menu list
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/2b11812b-535f-4be6-9945-5f0d612a556e)

Editing a menu item
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/615c1cf6-5b8c-4713-8c0a-dfaa6b1c65cd)

Adding a new menu item
![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/a0e830b3-27ba-4a4c-985c-60d9001a93bc)

  5.Settings

Component: Settings. 

Description: Allows the user to modify their account settings, including email and password updates.

Screenshots:

![image](https://github.com/Arijitb98/foodie-delight/assets/73586389/8dce6ea7-58c7-4895-b4a2-505d4febc245)


Setup Instructions:

  1.Clone the Repository
    
    git clone https://github.com/Arijitb98/foodie-delight.git

  2.Install Dependencies
  
    npm install or yarn

  3.Start the Development Server
  
    npm start or yarn start
    
  4.Access the Admin Panel
  
  Open a web browser and navigate to(assuming default port).
    
    http://localhost:3000 
    
  Log in with valid credentials to access the admin panel.


Deployment:

npm run build or yarn build


Demo: 

https://a56022e0-2471-492e-9bd2-6f914d5292b2.e1-eu-north-azure.choreoapps.dev/login