# Assignment 1 - Models 💾

- 💯 **Worth**: 8%
- 📅 **Due**: February 21, 2021 @ 23:59
- 🙅🏽‍ **Penalty**: Late submissions lose 10% per day to a maximum of 3 days. Nothing is accepted after 3 days and a grade of 0% will be given.

## 🎯 Objectives

- **Write** models to represent real-world entities of the application.
- **Transact** data to and from a database using models.

## 🔨 Setup

1. Navigate to `~/web-ii/Assignments`.
2. Click `Code -> 📋` to copy the URL to the repository.

   ![Clone Repo](images/1.2.1-Clone-Repo.png)

3. Clone the Git repo `git clone <paste URL from GitHub>` (without the angle brackets).
   - You may have to use the `HTTPS` or `SSH` URL to clone depending on your settings. If one doesn't work, try the other by clicking `Use SSH` or `Use HTTPS` above the 📋, and copy the new URL.
4. You should now have a folder inside `Assignments` called `assignment-1-githubusername`.
   - If you want, you can rename this folder to `1-Models` for consistency's sake! 😉
5. Set up the new database based on your preferred MySQL client:
   - `🖱️ GUI`
     1. Open MySQL Workbench and connect to the server that you setup in E1.3.
     2. Copy the contents of the `src/database/RedditDB.sql` into a new tab and run it.
     3. Refresh the _Schemas_ panel on the left to verify that the database was created.
   - `⌨️ CLI`
     1. Copy `src/database/RedditDB.sql` to `~/web-ii/SQL`
     2. Open a new terminal and run `mysql`. You should see your prompt change to something like this: `root@79cb92d46697:/#`.
     3. Run `mysql -u root -p < ~/SQL/RedditDB.sql` to execute the setup script inside of the database.
     4. The password is `rootpassword`. If you get no indication that anything happened, that means it was successful.

## 🔍 Context

Over the next several assignments, you will be building a **Reddit** clone web app. The web app will follow the *MVC architectural pattern*. In this assignment, you will be writing the **models** required to handle the data.

> 💡 Never been on Reddit? [Here's an explanation](https://www.youtube.com/watch?v=tlI022aUWQQ)!

Inside `src/models` you will see that the 4 concrete classes (`User`, `Category`, `Post`, and `Comment`) have been provided. **Using everything you have learned from E1.2 and E1.4, your task is to complete these classes so that they may successfully pass the test suites**. Just as before, the test suites will be available for you to use as much as you want while developing the models.

The `Database` class and abstract `Model` class have been provided for you. They will take care of connecting to the database and handling behaviour that is common among all concrete model classes. Most likely, you won't have to change anything in these classes. Simply use the `Model.connect()` method inside the concrete class methods when you need a connection to the database.

## 📈 ERD

Please take some time and get well acquainted with this entity-relationship diagram. We will be using this schema for all assignments.

![ERD](images/1.2.3-ERD.png)

> 💡 For this assignment, we'll only be implementing basic CRUD for the four main entities: `User`, `Category`, `Post`, and `Comment`. As we progress throughout the semester, we will add more and more functionality. By the end, we will have a fully-functional Reddit web application.

Even though we won't be implementing many of the features for this assignment, here are brief descriptions of the entities and what they do so that you have a better idea of the application as a whole:

- 👤 User
  - A user can create, moderate, and subscribe to categories.
  - A user can create and comment on posts (`URL` or `Text`).
  - A user can comment on posts and on other comments (i.e. replies).
  - A user can vote on posts and comments (⬆ upvote or ⬇ downvote).
  - A user can bookmark posts and comments.

- 📁 Category
  - A category (aka subreddit) is a collection of posts. The content of the posts in a certain category should pertain to the category's topic.
  - For example, the Star Wars category should contain posts about Star Wars. The Star Trek category should contain posts about Star Trek. If someone tried to post a Star Trek article in a Star Wars category, that post would probably get many downvotes from other users.
  - If a post is too inappropriate for a category, then the moderators of that category have the power of deleting that post.

- 📝 Post
  - A post can be `Text` (ex. your opinion on the last Star Wars movie)
  - A post can be a `URL` to another site (ex. a link to a Star Wars trailer on YouTube).
  - Both `Text` and `URL` posts have a title.
  - Only the content of a text post can be edited by the user who posted it.
  - Users can upvote or downvote the post based on whether they think it's a good post or not. The order of the posts shown to the user will usually be sorted by the net votes (upvotes minus downvotes) which leads to a feed where the content is curated by the community.
  - If a user really likes a post and wants to save it for future reference, they may bookmark the post.

- 💬 Comment
  - A comment can be left on a post (ex. "Your opinion about \<*the latest Star Wars movie*\> is wrong and here's why!") or on another comment (ex. "Your opinion about \<*why the original opinion about the latest Star Wars movie is wrong*\> is wrong, and here's why!").
  - Just like posts, user can upvote/downvote comments they think are good/bad for the conversation. Just like with posts, the most upvoted comments float to the top.
  - If a user really likes a comment and wants to save it for future reference, they may bookmark the comment.

## 🧪 Testing

> 💡 You must complete the tests in this order: `User > Category > Post > Comment`. This is because:
> - a `Comment` cannot be created without a `Post` existing in the database.
> - a `Post` cannot be created without a `Category` existing in the database.
> - a `Category` cannot be created without a `User` existing in the database.

If you stick a `.only` on a test, you know that Jest will skip all tests that don't have a `.only` on them. However, this does not apply for multiple files. Even if one test inside one file has `.only`, it will only run that one test in that one file, but it will still run all the other tests in all the other files. This can get annoying when working so here are a couple of options to only **run one test suite at a time**:

1. Specify the name of the test suite as an argument: `npm run test -- user.test.js` (**easier**)
2. Use Jest's "_watch_" mode: `npm run testWatch` (**more advanced**)
   - This will start the test runner as normal, but once it finishes, it will not end the process. Instead, it will wait for you to save a file. Once you make changes to your code and save, the test runner will automatically run again.
   - In this mode, you can specify many things (seen below), one of which is only running tests (or test suites) that match a regex.

     ```text
     Watch Usage
      › Press f to run only failed tests.
      › Press o to only run tests related to changed files.
      › Press p to filter by a filename regex pattern.
      › Press t to filter by a test name regex pattern.
      › Press q to quit watch mode.
      › Press Enter to trigger a test run.
     ```

   - For example, if you hit `p` and then typed `user`, it would run only test suites that had `user` in the name. In our case, that would be `user.test.js`.

   - A caveat to this is that the process will end if something breaks your code at runtime like an uncaught exception or a database connection waiting to be closed. However, once you figure out how to handle the major things that can break your code, using _watch mode_ can lead to a pleasant development experience. 😊

## ❓ FAQ

> Are all the tests worth the same amount of points?

  The `* was not created with *` are worth half since you could theoretically just `return null` for those functions and get a third the tests in total to pass.

> Shouldn't we return or log an error message instead of returning null for the unhappy paths?

  In a future assignment I will test actual error messages. For now, it is sufficient to only `return null` or `return false` (according to the tests) if something bad happens.

> How come you're not testing if the newly created object's `createdAt` date is populated?

  A newly created object should have a null `createdAt` value. This will seem counterintuitive for now, but you will see why in the coming weeks. 😉

> How can you `findById` something that has been deleted?

  Unlike previous exercises, we will not be executing any `DELETE` SQL statements. When you call the `delete` method on an object,  execute an `UPDATE` statement that sets the `deleted_at` column to `NOW()`.

> What's the point of that?

  Most companies don't actually delete any data. Data is very valuable and to delete anything that could be useful for reporting in the future would be counterintuitive to the company's [bottom line](https://www.merriam-webster.com/dictionary/bottom-line). Keeping data of an application's activity (i.e. when things were created/edited/deleted) also helps with debugging later down the road.

> Sometimes a test will randomly fail even though I didn't change anything. What's up with that?

  Since we're using the `faker` library to generate random strings, it is possible that sometimes it will generate two strings where one contains the other. This could then lead to a test failing if the test is checking for two strings to be _completely_ not equal. Not likely, but possible!

## 🌿 Git

I know most people are used to using the GitHub desktop client, but **I strongly urge you to try the Git CLI**. It's the same reason for trying the MySQL CLI: _it's easier to go from CLI to GUI than the other way around_! If you're adamant to not use the CLI, then you can also use VSC's built-in Git GUI client.

### 🖱️ GUI

1. Work on getting one single test to pass. Once you do, click on the third icon down in the left navigation bar to see a list of files that have changed and are ready to be staged.
2. Hover over where it says _Changes_ (right below the commit textbox) and click `+` to stage all the modified files to be committed. Alternatively, you can add specific files by clicking the `+` next to the individual file.
3. Type a commit message into the textbox and click the checkmark above it to commit all the files that were just staged.
4. Click `...` and then `push` to push the commit(s) up to GitHub.
5. Go back to step 1 with the next test.

### ⌨️ CLI

1. Work on getting one single test to pass. Once you do, run `git status` to see a list of files that have changed and are ready to be staged.
2. Run `git add .` to stage all the modified files to be committed. Alternatively, you can add specific files like this: `git add src/models/User.js`.
3. Run `git commit -m "A descriptive message here."` to commit all the files that were just staged.
4. Run `git push` to push the commit(s) up to GitHub.
5. Go back to step 1 with the next test.

Regardless of the method you choose, it is very important that you commit frequently because:

- If you end up breaking your code, it is easy to revert back to a previous commit and start over.
- It provides a useful log of your work so that you (and your teammates if/when you're on a team) can keep track of the work that was done.

## 📥 Submission

You'll already know what your grade is before submitting since the grade for this assignment will come purely from your test results. If you pass all the tests, you get 💯!

Check that all tests are passing by removing all occurrences of `.only` and running the test suite for the final time. Once you've made your final `git push` to GitHub, here's what you have to do to submit:

1. Go to [Gradescope](https://www.gradescope.ca/courses/828) and click the link for this assignment.
2. Select the correct repository and branch from the dropdown menus.
3. Click _Upload_.
4. Wait for the autograder to finish grading your submission. Once it's done, you should see the final output of the test results as well as your grade on the top right.
