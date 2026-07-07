export const q1Response = `Sorry. I could not find an answer to your question.\n\nTry rephrasing your question with more details. For help, use a question template.\n\nOr, select one of these questions about **Changing lead carer for a child**, which might help you.\n\n- What is the process for changing the lead carer for a child in a Universal Credit claim?\n- How does a claimant nominate a new lead carer for a child in a shared custody arrangement?\n- What happens if two parents cannot agree on who should be the lead carer for a child?`;

export const q2Response = `### Eligibility Criteria for Universal Credit for Claimants Under 18

#### General Rules
- Claimants under 18 are not usually entitled to Universal Credit.
- There are specific exceptions where a young person under 18 may qualify.

#### Exceptions for Eligibility
A young person under 18 may be eligible for Universal Credit if they meet at least one of the following conditions:

1. **Health Conditions or Disabilities**
   - They were receiving Employment and Support Allowance.
   - They have limited capability for work.
   - They are in education and receive Disability Living Allowance or Personal Independence Payment.

2. **Health-Related Evidence**
   - They are not in full-time education.
   - They provide medical evidence of a health condition or disability.
   - They are waiting for a Work Capability Assessment.

3. **Pregnancy**
   - They are pregnant and within 11 weeks or less of the expected week of childbirth.
   - They are not in full-time advanced or non-advanced education.

4. **Post-Pregnancy**
   - They were pregnant and have given birth in the last 15 weeks.
   - They no longer have the child due to reasons such as:
     - The baby was stillborn.
     - The baby has passed away.
     - The baby is now in the care of another person.

5. **Without Parental Support**
   - They are not living with their parents and are without parental support.

6. **Responsibility for a Child**
   - They are responsible for a child.

7. **Caring Responsibilities**
   - They have regular and substantial caring responsibilities for a severely disabled person.
   - They are not in full-time education.

8. **Part of a Couple**
   - They are part of a couple where the other person is responsible for a child.
   - The other person must meet the basic conditions of entitlement for Universal Credit.

#### Additional Considerations
- Claimants under 18 are expected to accept their Claimant Commitment, similar to adult claimants.
- They will be placed in a Labour Market regime based on their personal circumstances and capabilities.
- If the claimant is in full-time non-advanced education (up to A Level or equivalent) and has no parental support, they may qualify for Universal Credit until they turn 21 or complete their course if they turn 21 during the course.

#### Important Notes
- In England, 16 and 17-year-olds are expected to be in education or training. If they are not, they must meet the eligibility conditions to qualify for Universal Credit.
- If a 16 or 17-year-old claims Universal Credit, any Child Benefit being paid for them will stop.`;

export const q5Response = `Sorry, I cannot help with questions about **HR policies for DWP staff**.\n\nFor information on policies for staff, visit [Human Resources (opens in a new tab)](https://intranet.dwp.gov.uk/section/working-dwp/human-resources).\n\nUse DWP Ask to help you find Universal Learning guidance.`;

export function returnPrototypeResponse(counter: number) {
  const q1 = {
    answer: q1Response,
    citations: [],
    id: 314,
    answer_gen_enabled: true,
    question_feedback: {
      topic_label: "Changing lead carer for a child",
      preamble:
        "Sorry. I could not find an answer to your question.\n\nTry rephrasing your question with more details. For help, use a question template.\n\nOr, select one of these questions about **Universal Credit for under 18s**, which might help you.",
      postscript: null,
      out_of_scope: false,
      suggested_questions: [
        "What are the eligibility criteria for Universal Credit for claimants under 18?",
        "Can a 16 or 17-year-old claim Universal Credit if they are estranged from their parents?",
        "What support is available for under 18s claiming Universal Credit in England?",
      ],
    },
  };

  const q2 = {
    answer: q2Response,
    citations: [
      {
        title: "Under 18s: Guidance",
        highlights_url:
          "https://intranet.dwp.gov.uk/policy/under-18s-guidance#:~:text=another,other%20person%20is%20responsible%20for%20a%20child%2C%20but",
        chunks: "",
      },
      {
        title: "Eligibility for Universal Credit: Guidance",
        highlights_url:
          "https://intranet.dwp.gov.uk/policy/eligibility-universal-credit-guidance#:~:text=To%20be%20eligible%20for%20Universal%20Credit%20a%20claimant,the%20GB%20residency%20requirements%20-%20see",
        chunks: "",
      },
    ],
    id: 2,
    answer_gen_enabled: true,
    question_feedback: null,
  };

  const q3 = {
    answer: "blank",
    citations: [],
    id: 314,
    answer_gen_enabled: true,
    question_feedback: {
      topic_label: "Budgeting Advances",
      preamble:
        "Sorry. I could not find an answer to your question.\n\nTry rephrasing your question with more details. For help, use a question template.\n\nOr, select one of these questions about **Budgeting Advances**, which might help you.",
      postscript: null,
      out_of_scope: false,
      suggested_questions: [
        "How long must a claimant have been on Universal Credit before they can get a Budgeting Advance?",
        "What is the maximum Budgeting Advance amount?",
        "What expenses can a Budgeting Advance be used for?",
      ],
    },
  };

  const q4 = {
    answer: `### Eligibility Criteria for a Budgeting Advance

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

- Budgeting Advance: A loan provided to help with emergency household costs, such as buying furniture or paying for unexpected expenses, which is repaid through deductions from Universal Credit payments.
`,
    citations: [
      {
        title: "Advances: Budgeting Advance: Guidance",
        url: "https://intranet.dwp.gov.uk/policy/advances-budgeting-advance-guidance#:~:text=for%20at%20least%206,for%20a%20couple",
        chunks: "",
      },
    ],
    id: 316,
    answer_gen_enabled: true,
    question_feedback: null,
  };

  const q5 = {
    answer: q5Response,
    citations: [],
    id: 3,
    answer_gen_enabled: true,
    question_feedback: {
      topic_label: "HR policies for DWP staff",
      preamble: null,
      postscript: null,
      out_of_scope: true,
      suggested_questions: [],
    },
  };

  const responses = [q1, q2, q3, q4, q5];
  const response = responses[counter - 1];

  return response;
}
