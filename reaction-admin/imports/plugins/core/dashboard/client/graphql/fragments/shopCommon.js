import gql from "graphql-tag";

export default gql`
 fragment ShopCommon on Shop {
    _id
    allowGuestCheckout
    addressBook {
      company
      fullName
      address1
      address2
      city
      region
      postal
      country
      phone
      isCommercial
    }
    baseUOL
    baseUOM
    currency {
      code
    }
    defaultParcelSize {
      width
      weight
      height
      length
    }
    description
    emails {
      address
    }
    location {
      coordinates
    }
    keywords
    language
    name,
    whatsappNumber,
    slug
    timezone
    unitsOfLength {
      uol
      label
    }
    unitsOfMeasure { 
      uom
      label
    }
  }
`;


