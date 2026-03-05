const downloadMessagesCsv = async () => {
  const a = document.createElement("a");
  a.href = "/api/download-messages-csv";
  a.download = "messages.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default downloadMessagesCsv;
