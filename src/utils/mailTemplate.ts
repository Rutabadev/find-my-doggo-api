export const singleButtonTemplate = (message, link, buttonText) => `
      <div style="font-family: system-ui, sans-serif; text-align: center">
         <p>${message}</p>
         <a
            href="${link}"
            style="
               display: inline-block;
               border: none;
               border-radius: 0.25rem;
               padding: 0.5rem 1.5rem;
               background-color: rgb(79, 70, 229);
               color: rgb(243, 244, 246);
               font-size: 1rem;
               text-decoration: none;
            "
         >
            ${buttonText}
         </a>
      </div>
    `;
