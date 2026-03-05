export const q2Response = `### Eligibility Criteria for a Budgeting Advance

#### General Requirements

- The claimant must not have any recovery of a previous Budgeting Advance outstanding.
- The claimant must have been in continuous receipt of one of the following benefits for at least 6 months:
  - Universal Credit
  - Income Support
  - Jobseeker's Allowance (income-based)
  - Employment and Support Allowance (income-related)
  - Pension Credit

#### Financial Criteria

- The requested Budgeting Advance must be:
  - At least £100 (minimum amount).
  - No more than the maximum amount allowed for their circumstances:
    - £348 for a single adult.
    - £464 for a couple.
    - £812 for a single person or couple with children.
- The claimant must not have earned more than the allowable earnings in the previous 6 assessment periods:
  - £2,600 for a single claimant (with or without children).
  - £3,600 for a couple (with or without children).

#### Additional Considerations

- Earnings include income from sources such as:
  - Maternity Allowance.
  - Statutory Adoption Pay.
  - Statutory Maternity Pay.
  - Statutory Neonatal Care Pay.
  - Statutory Parental Bereavement Pay.
  - Statutory Sick Pay.
  - Ordinary Statutory Paternity Pay.
  - Additional Statutory Paternity Pay.

#### Other Conditions

- The claimant must not have a partner who has recovery of a Budgeting Advance outstanding.
- The claimant must demonstrate that they can afford to repay the advance from their Universal Credit payments within the required timescales.

#### Glossary

- Budgeting Advance: A loan provided to help with emergency household costs, such as buying furniture or paying for unexpected expenses, which is repaid through deductions from Universal Credit payments.`;

export const q3Response = `### Should a Claimant Have an Appointee?

#### Eligibility for an Appointee

A claimant may need an appointee if:

- They are incapable of managing their benefit affairs due to mental incapacity or severe physical disability.
- They do not already have someone with higher authority, such as a court-appointed deputy or someone with Power of Attorney, acting on their behalf.

A claimant does not need an appointee if:

- They are simply unable to collect their benefits but can otherwise manage their own affairs.
- They no longer wish to manage their own affairs but are still capable of doing so.
- They can manage their own affairs but need someone they trust to collect their benefits for them. In this case, they can arrange for someone to do this without appointing an appointee.

#### Process for Appointing an Appointee

- The claimant must be visited to confirm that they are eligible and require an appointee.
- The prospective appointee must be interviewed to confirm their suitability and to explain their role and responsibilities.
- A BF56 form is completed with the prospective appointee, including evidence showing the claimant’s incapacity to manage their own affairs.
- If the appointee is deemed suitable, a BF57 form is issued to confirm the appointment.

#### Responsibilities of an Appointee

- The appointee becomes responsible for managing the claimant’s Universal Credit claim, including receiving payments into their own bank account on behalf of the claimant.

#### When an Appointee is No Longer Required

- If the claimant states they no longer need an appointee and can manage their claim independently, a review must be conducted.
- The existing appointee must be contacted for confirmation.
- If the appointee is no longer required, the claimant will take full responsibility for their claim, including receiving payments into their own bank account.

#### Important Notes

- An appointee is not appropriate for claimants who are capable of managing their own affairs but face logistical issues like accessing a bank.
- The decision to appoint an appointee must be carefully considered and documented.

#### Glossary

- BF56: Form used to document the appointment process and evidence of the claimant’s incapacity.
- BF57: Form issued to confirm the appointment of an appointee.`;

export function returnPrototypeResponse(counter: number) {
  const q2 = {
    answer: q2Response,
    citations: [
      {
        title: "Advances: Budgeting Advance: Guidance",
        url: "https://intranet.dwp.gov.uk/policy/advances-budgeting-advance-guidance#:~:text=for%20at%20least%206,for%20a%20couple",
        chunks: "",
      },
    ],
    default_response: false,
    id: 2,
  };
  const q3 = {
    answer: q3Response,
    citations: [
      {
        title:
          "Appointees, Personal Acting Bodies and Corporate Acting Bodies: Guidance",
        url: "https://intranet.dwp.gov.uk/policy/appointees-personal-acting-bodies-and-corporate-acting-bodies-guidance#:~:text=deputy%20or%20a%20Power%20of,able%20to%20arrange%20for%20a%20person%20they%20know%20and",
        chunks: "",
      },
      {
        title: "New claims: Guidance",
        url: "https://intranet.dwp.gov.uk/policy/new-claims-guidance#:~:text=If%20the%20claimant%20has%20an%20appointee%2C%20the%20appointee,in%20the%20Appointees%2C%20Personal%20Acting%20Bodies",
        chunks: "",
      },
    ],
    default_response: false,
    id: 3,
  };

  const q1 = {
    answer:
      "Apologies, I cannot answer your question. Please rephrase or provide more details. If this is not a guidance related question, please refer to resources under Universal Learning.",
    citations: [],
    default_response: true,
    error: true,
    type: "error",
    id: 1,
  };

  const responses = [q2, q3];
  const response = responses[counter - 1];

  return response;
}
