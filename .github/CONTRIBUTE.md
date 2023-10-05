# Contributing

## Request for changes/ Pull Requests

I recommend you to create a fork of the [antd-input-otp](https://github.com/Ralfarios/antd-input-otp) repository to commit your changes to it first. Then add your fork as a local project:

```sh
# Using HTTPS
git clone https://github.com/Ralfarios/antd-input-otp.git

# Using SSH
git clone git@github.com:Ralfarios/antd-input-otp.git
```


Then, go to your local folder

```sh
cd antd-input-otp
```

Add git remote controls :

```sh
# Using HTTPS
git remote add fork https://github.com/YOUR-USERNAME/antd-input-otp.git
git remote add upstream https://github.com/Ralfarios/antd-input-otp.git


# Using SSH
git remote add fork git@github.com:YOUR-USERNAME/antd-input-otp.git
git remote add upstream git@github.com:Ralfarios/antd-input-otp.git
```

You can now verify that you have your two git remotes:

```sh
git remote -v
```

## Receive remote updates

In view of staying up to date with the central repository :

```sh
git pull upstream master
git pull upstream development
```

## Choose a base branch

Before starting development, you need to know which branch to base your modifications/additions on. I strongly use `development` branch since `main` branch is only for production. For keep it tracked and readable, I've create a convention for naming a branch. 

Here's the table for the flag of the branch.

| Flag     | Description                                               |
| -------- | --------------------------------------------------------- |
| feat     | A new Feature                                             |
| fix      | For Bugfix or Hotfix                                      |
| test     | Adding missing tests or correcting existing tests         |
| chore    | Other changes that don't modify src or test files         |
| refactor | A code change that neither fixes a bug nor adds a feature |
| revert   | Reverts a previous commit                                 |
| docs     | documentation only changes                                |

```sh
# Switch to the desired branch
git checkout development

# Pull down any upstream changes
git pull

# Create a new branch to work on
git checkout -b fix/something-that-you-can-fix
```

Commit your changes, then push the branch to your fork with `git push -u fork` and open a pull request on the [Antd Input OTP repository](https://github.com/Ralfarios/antd-input-otp/) following the template provided.
