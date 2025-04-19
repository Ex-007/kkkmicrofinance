import axios from 'axios'

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!body?.to || !body?.message) {
    return {
      success: false,
      error: 'Missing "to" or "message" in request body.',
    }
  }

  try {
    const response = await axios.post('https://api.sendchamp.com/api/v1/sms/send', {
      to: [body.to],
      message: body.message,
      sender_name: body.sender || 'Schamp',
      route: body.route || 'dnd',
    }, {
      headers: {
        Authorization: `Bearer ${config.sendchampKey}`,
        'Content-Type': 'application/json',
      },
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'SMS sending failed',
    }
  }
})
