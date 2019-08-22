const { notifyClient, sendNotification } = require("./../../utils");
const fs = require("fs").promises;
const path = require("path");

const sendFile = async fileName => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "/", fileName)
    );
    const file = Buffer.from(data);
    const link = await notifyClient.prepareUpload(file);
    return link;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

module.exports = async app => {
  app.get("/remind", async (req, res) => {
    const session = req.session;

    if (session && session.email) {
      const file = await sendFile("the-file.pdf");
      const templateId = process.env.REMIND_TEMPLATE_ID;
      await sendNotification({
        email: session.email,
        templateId: templateId,
        options: {
          personalisation: {
            link: "https://digital.canada.ca",
            file: file
          },
          reference: "Remind"
        }
      });
    }

    res.render("remind/index", { data: req.session });
  });
};
