# Crush2020

When we crushed the midterms two years ago, we figured the formula would be easily replicated for the 2020 election. Little did we know that a pandemic would bring political organizing as we know it to a grinding halt, making many of the typical means of volunteering and supporting campaigns nearly impossible.

It’s because of this deadly serious wrench that we need democracy-supporting tools more than ever, which is why we've built Crush2020.

Much like Crush the Midterms, Crush2020 asks users a series of questions to determine their geography, their availability leading up to Election Day, the skills they can lend to campaigns, and how much money they can budget to donate to competitive races. But with the myriad challenges facing voters this year, it also helps them request absentee/mail-in ballots, keep track of important voting deadlines, and suggests alternative forms of volunteering that suit our socially-distanced world.

## Development

This site is built with Gatsby.js and the US Web Design System React components

```
yarn install
yarn start
go to http://localhost:8000
```

## Data

The matching system uses data from the following sources:
- FEC: House and Senate candidate names and reported funds raised
- FollowTheMoney.org: Statewide candidate names and funds raised
- CookPolitical: House, Senate, Governor and Electoral College ratings
- BallotPedia: State legislature seats up and current party margin
- Mobilze.us: Volunteer links
- ActBlue: Donation links

No ownership over this data is claimed and it is included in the respository merely as a development convenience.
Data from FollowTheMoney.org is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 United States License by the National Institute on Money in State Politics.

## Deployment

Crush2020.org is hosted on Netlify. Push to master and it'll go live in a few minutes.

To work on the backend functions locally, install [netlify-cli](https://docs.netlify.com/cli/get-started/)

```
yarn backend
go to http://localhost:8888
```