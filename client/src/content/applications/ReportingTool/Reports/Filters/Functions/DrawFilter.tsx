import React from "react";
import DropdownLocationFilter from "../Design/LocationsCombo";
import DropdownProductFilter from "../Design/ProductsCombo";
import DropdownCategoryFilter from "../Design/CategoriesCombo";
import DropdownTrueFalseFilter from "../Design/TrueFalseCombo";
import { FilterChangeType, ReportFilterModel } from "../../Models/AllInterfaces";
import DateRangeFilter from "../Design/DateRangeFilter";
import DropdowSupplierFilter from "../Design/SuppliersCombo";
import DropdownTendersFilter from "../Design/TendersCombo";
import DropdownProjectsFilter from "../Design/ProjectsCombo";
import DropdownUsersFilter from "../Design/UsersCombo";

export const DrawFilter: React.FC<{
  filter: ReportFilterModel;
  handleFilterChange: FilterChangeType;
}> = ({ filter, handleFilterChange }) => {
   
  switch (filter.type) {
    case "dropdown_product":
      return (
        <DropdownProductFilter
          filter={filter}
          onChange={handleFilterChange}
        ></DropdownProductFilter>
      );
    case "dropdown_category":
      return (
        <DropdownCategoryFilter
          filter={filter}
          onChange={handleFilterChange}
        ></DropdownCategoryFilter>
      );

      
      case "dropdown_tender":
        return (
          <DropdownTendersFilter
            filter={filter}
            onChange={handleFilterChange}
          ></DropdownTendersFilter>
        );

        case "dropdown_project":
          return (
            <DropdownProjectsFilter
              filter={filter}
              onChange={handleFilterChange}
            ></DropdownProjectsFilter>
          );
      case "dropdown_supplier":
        return (
          <DropdowSupplierFilter
            filter={filter}
            onChange={handleFilterChange}
          ></DropdowSupplierFilter>
        );
        case "dropdown_user":
          return (
            <DropdownUsersFilter
              filter={filter}
              onChange={handleFilterChange}
            ></DropdownUsersFilter>
          );
    case "dropdown_location":
      return (
        <DropdownLocationFilter
          filter={filter}
          onChange={handleFilterChange}
        ></DropdownLocationFilter>
      );
    case "dropdown_truefalse":
      return (
        <DropdownTrueFalseFilter
          filter={filter}
          onChange={handleFilterChange}
        ></DropdownTrueFalseFilter>
      );
    case "daterange":
      return (
        <DateRangeFilter
          filter={filter}
          onChange={handleFilterChange}
        ></DateRangeFilter>
      );
      
    // case "dropdown":
    //   return (
    //     <select
    //       value={filter.value as string | undefined}
    //       onChange={(e) => handleFilterChange(filter.name, e.target.value)}
    //     >
    //       <option value="">Select an option</option>
    //       {filter.options?.map((option, index) => (
    //         <option key={index} value={option as string}>
    //           {option}
    //         </option>
    //       ))}
    //     </select>
    //   );
    case "dropdown":
      return (
        <select
          value={filter.value as string | undefined}
          onChange={(e) => handleFilterChange(filter.name, e.target.value)}
        >
          <option value="">Select an option</option>
          {filter.options?.map((option, index) => (
            <option key={index} value={option as string}>
              {String(option)} {/* Convert option to string if necessary */}
            </option>
          ))}
        </select>
      );

    // case "datepicker":
    //   return (
    //     <input
    //       type="date"
    //       value={filter.value as string | undefined}
    //       onChange={(e) => handleFilterChange(filter.name, e.target.value)}
    //     />
    //   );
    default:
      return null;
  }
};
