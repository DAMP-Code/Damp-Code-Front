import React from "react";

// mensagem de sucesso ou erro embaixo de cada seção das configurações
const Feedback = ({ status }) =>
  status ? (
    <p role="status" className={`text-sm font-medium ${status.ok ? "text-success" : "text-danger"}`}>
      {status.text}
    </p>
  ) : null;

export default Feedback;
