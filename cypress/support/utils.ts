

export const getFile = (path, mime): Promise<{ file: File; dataTransfer: DataTransfer }> => {
  return new Promise((resolve) => {
    cy.fixture(path, 'base64')
      .then(content => Cypress.Blob.base64StringToBlob(content, mime))
      .then((blob) => {
        const file = new File([blob], path, { type: mime });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(file);

        resolve({ file, dataTransfer });
      });
  });
};
