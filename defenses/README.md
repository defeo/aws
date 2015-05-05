# Defense reservation app

This is an app for my students to book a slot for their project
defense.  It integrates data on students and project groups with a
calendar interface, permitting students to sign up for a defense slot.

## App structure

- Data on students projects is taken from a hand-curated
  [static json file](https://github.com/defeo/aws/blob/gh-pages/_data/projects-2015.json).

- Reservation data is stored in a
  [Firebase](https://www.firebase.com/) backend. The backend is
  responsible for notifying all connected users of data changes.

- The UI is written in [React.js](https://facebook.github.io/react/),
  it is a rather straightforward view on the groups and reservation
  data.

The app is rather tightly integrated with the rest of this site, but
it shouldn't be too hard to extract the React components and their
Firebase integration, and use them for your own application.

Happy coding!
