module.exports = {
  generateRandomString,
  generateRandomInt,
  selectRandomStatus
};

function generateRandomString(userContext, events, done) {
  const randomString = Math.random().toString(36).substring(2, 15);
  userContext.vars.randomString = randomString;
  return done();
}

function generateRandomInt(userContext, events, done) {
  const randomInt = Math.floor(Math.random() * 1000) + 1;
  userContext.vars.randomInt = randomInt;
  return done();
}

function selectRandomStatus(userContext, events, done) {
  const statuses = ['Todo', 'In Progress', 'Done'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  userContext.vars.randomStatus = randomStatus;
  return done();
}