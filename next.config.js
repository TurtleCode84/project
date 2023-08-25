module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.tracktask.eu.org",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "u.cubeupload.com",
        pathname: "/*/*",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/*/*",
      },
      {
        protocol: "https",
        hostname: "api.wasteof.money",
        pathname: "/*/*/*",
      },
    ],
    //domains: ["tracktask.eu.org"],
  },
};
