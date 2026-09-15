import React from 'react'

function handleLogoChange(e) {
  const file = e.target.files[0]

  if (!file) return

  const previewUrl = URL.createObjectURL(file)

  setHackathon({
    ...hackathon,
    logo: previewUrl,
    logoFile: file
  })
}

export default handleLogoChange