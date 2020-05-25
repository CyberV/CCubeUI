# SS Initial Repo

Initial Repository for SSewa App. 


## How It Works

After the user navigates to Tab 2 (Photos), they can tap/click on the camera button to open up the device's camera. After taking or selecting a photo, it's stored permanently into the device's filesystem. When the user reopens the app at a later time, the photo images are loaded from the filesystem and displayed again in the gallery. The user can tap on a photo to be presented with the option to remove the photo.

## Feature Overview
* App framework: [Angular](https://angular.io)
* UI components: [Ionic Framework](https://ionicframework.com/docs/components)
  * Camera button: [Floating Action Button (FAB)](https://ionicframework.com/docs/api/fab)
  * Photo Gallery display: [Grid](https://ionicframework.com/docs/api/grid)
  * Delete Photo dialog: [Action Sheet](https://ionicframework.com/docs/api/action-sheet) 
* Native runtime: [Capacitor](https://capacitor.ionicframework.com)
  * Taking photos: [Camera API](https://capacitor.ionicframework.com/docs/apis/camera)
  * Writing photo to the filesystem: [Filesystem API](https://capacitor.ionicframework.com/docs/apis/filesystem)
  * Storing photo gallery metadata: [Storage API](https://capacitor.ionicframework.com/docs/apis/storage)

## Project Structure
* Tab2 (Photos) (`src/app/tab2/`): Photo Gallery UI and basic logic.
* PhotoService (`src/app/services/photo.service.ts`): Logic encapsulating Capacitor APIs, including Camera, Filesystem, and Storage.
* Backend Directory (`backend/`): Node + Express Backend with User routes exposed at `/api/user/`.
* Data extracted from MongoDB Atlas instance using Mongoose.

## How to Run

> Note: It's highly recommended to follow along with the [tutorial guide](https://ionicframework.com/docs/angular/your-first-app), which goes into more depth, but this is the fastest way to run the app. 

For FrontEnd (`/`)
0) Install Ionic if needed: `npm install -g @ionic/cli`.
1) Clone this repository.
2) In a terminal, change directory into the repo: `cd photo-gallery-capacitor-ng`.
3) Install all packages: `npm install`.
4) Run on the web: `ionic serve`.
5) Run on iOS or Android: See [here](https://ionicframework.com/docs/building/running).

For Backend (`/backend/`)
0) Install all packages: `npm install`.
1) Install Nodemon: `npm -i -g nodemon`
6) Run server.js in backend : `nodemon server.js`

> Note: You will need to whitelist your IP in MongoDB Atlas Instance. Contact author for creds

## Contribution Guidelines

1) All commits to be pushed in contributor's feature branch (to be forked from `develop` branch).
2) Branches to be merged to `develop` branch via PR's. No PR to be merged without Revier's approval.
3) Commits to follow pattern: `[COMMIT_TYPE]: [TICKED_ID] Description`
    *[COMMIT_TYPE] = SETUP / FIX / MERGE / IMPROV 

EXACT STEPS:

1. Switch to develop branch 
    - git checkout develop
2. Take latet Pull from develop
    - git pull origin develop
3. Create Feature branch under developer name with reference to JIRA ticket:
    - git checkout -b feature/fname/SS-TicketNumber 
4. Make changes and commit to feature branch.
    - git commit -am "SS-TicketNumber | Commit message"
5. Push feature branch to origin    
    - git push origin feature/fname/SS-TicketNumber
6. Create PR from feature branch into develop. Add reviewers.
7. Wait for PR Review comments and Incorporate Review Comments (if any) in the feature branch
8. Once approved, Approver will merge PR into develop