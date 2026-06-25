exports.handler = async (event) => {
  try {
    console.log("RAW BODY:", event.body);

    let body = {};

    if (event.body) {
      body = typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;
    }

    console.log("PARSED BODY:", body);

    const goal = body.goal;

    if (!goal) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          debug: {
            raw: event.body,
            parsed: body
          },
          plan: "Brak celu treningowego (goal)"
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        goalReceived: goal,
        plan: `Plan dla celu: ${goal}`
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message
      })
    };
  }
};
