# Contributing to Nearby Escapes

Welcome! When working with multiple team members, it's easy to run into merge conflicts if someone is working on an older version of the codebase. Please follow these Git best practices to keep collaboration smooth and conflict-free.

## 1. Always Pull Before You Start Working
Before you begin writing new code for the day, ensure your local copy is up to date with the main repository. We recommend pulling with rebase to keep the Git history clean:

```bash
git checkout main
git pull --rebase origin main
```
*(Pro-tip: Run `git config --global pull.rebase true` once on your machine to make this the default behavior!)*

## 2. Work on Feature Branches
**Do not write code directly on the `main` branch.** 
Always create a new branch for the feature or fix you are working on. This isolates your work and prevents conflicts with other team members.

```bash
git checkout -b feature/your-feature-name
```
When you are finished, you can push your branch and open a Pull Request.

## 3. Dealing with Uncommitted Changes (Stashing)
If you have uncommitted work on an older version of the code and you need to pull down recent updates, a standard `git pull` might fail. You can temporarily "stash" your work, pull the updates, and then pop your work back on top:

```bash
git stash             # Temporarily saves your uncommitted changes
git pull origin main  # Pulls down the latest updates
git stash pop         # Re-applies your saved changes
```

## 4. Resolving Merge Conflicts
If you do encounter a merge conflict (e.g., you and another developer edited the exact same line of code):
1. **Do not panic!** Git will pause and mark the conflicting files.
2. Open the project in **VS Code**.
3. VS Code will highlight the conflicting lines in bright colors.
4. Click **"Accept Incoming Change"** (the new code from the repo) or **"Accept Current Change"** (your local code), or manually edit the code to combine both.
5. Save the file, run `git add <file>`, and then `git commit` or `git rebase --continue` to finish.

## 5. Commit Often
Make small, atomic commits rather than one massive commit at the end of the week. This makes it much easier to track down bugs and resolve conflicts if they happen.

```bash
git commit -m "feat: added new navigation bar"
```
