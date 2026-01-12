import React from "react";

const CertificateTemplate = React.forwardRef(({ item }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "800px",
        padding: "25px",
        fontFamily: "Times New Roman, serif",
        background: "#fff",
        border: "3px solid #000",
      }}
    >
      {/* INNER BORDER */}
      <div
        style={{
          border: "2px solid #000",
          padding: "25px",
        }}
      >
        {/* TITLE */}
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
          Certificate of Achievement
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            marginTop: "0",
          }}
        >
          This is to certify that
        </p>

        {/* STUDENT NAME */}
        <h3
          style={{
            textAlign: "center",
            margin: "20px 0",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          KRISHNA VARMA.P
        </h3>

        {/* DETAILS TABLE */}
        <table
          width="100%"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            marginTop: "20px",
            fontSize: "15px",
          }}
        >
          <tbody>
            {[
              ["Subject", item.subject],
              ["Competition", item.competition],
              ["Grade", item.grade],
              ["Course Completed", item.completed],
              ["Status", item.status],
              ["Date", item.date],
            ].map(([label, value], index) => (
              <tr key={index}>
                <td
                  style={{
                    width: "40%",
                    fontWeight: "bold",
                    paddingLeft: "40px",
                  }}
                >
                  {label}
                </td>
                <td style={{ width: "60%" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "80px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 40px",
            fontWeight: "bold",
          }}
        >
          <div style={{ borderTop: "1px solid #000", paddingTop: "6px" }}>
            Authorized Signature
          </div>

          <div style={{ borderTop: "1px solid #000", paddingTop: "6px" }}>
            School Seal
          </div>
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;
