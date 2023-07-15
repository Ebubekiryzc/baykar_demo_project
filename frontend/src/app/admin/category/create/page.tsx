"use client";
import axiosInstance from "@/lib/axios";
import generateSlug from "@/lib/slugify";
import { getLocalStorageItem } from "@/lib/utils";
import styles from "@/styles/uavadmincreate.module.css";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface CategoryAdminCreatePageProps {}

const CategoryAdminCreatePage: FC<CategoryAdminCreatePageProps> = ({}) => {
  const router = useRouter();
  const initialFormData = Object.freeze({
    nameEn: "",
    nameTr: "",
  });
  const [formData, setFormData] = useState(initialFormData);
  // @ts-expect-error
  const handleChange = (e) => {
    setFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  // @ts-expect-error
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.nameEn.length <= 0 || formData.nameTr.length <= 0) {
      return;
    }

    axiosInstance
      .post(
        `uavs/uav-categories/`,
        {
          translations: {
            en: {
              name: formData.nameEn,
              slug: generateSlug(formData.nameEn),
            },
            tr: {
              name: formData.nameTr,
              slug: generateSlug(formData.nameTr),
            },
          },
        },
        {
          headers: {
            Authorization: `JWT ${getLocalStorageItem("access_token", null)}`,
          },
        }
      )
      .then((res) => {
        router.push("/admin/category/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <main className="section-padding">
      <div className="container d-flex flex-column gap-3 align-items-center justify-content-center w-100 h-100">
        <h1
          className={`text-align-left fs-1 flex-shrink-1 fw-bold ${styles.formTitle}`}
        >
          Create Category
        </h1>
        <form onSubmit={(e) => handleSubmit(e)} className="form">
          <div className="form-floating mb-4">
            <input
              type="text"
              className={`form-control ${styles.userInput}`}
              id="nameEn"
              placeholder="name"
              name="nameEn"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="nameEn">English Name</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="text"
              className={`form-control ${styles.userInput}`}
              id="nameTr"
              placeholder="name"
              name="nameTr"
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="nameTr">Turkish Name</label>
          </div>
          <button
            type="submit"
            className="btn btn-success d-flex w-100 justify-content-center align-items-center"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  );
};

export default CategoryAdminCreatePage;
